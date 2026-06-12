#!/usr/bin/env node
/**
 * このテンプレートリポジトリから新しいCloudflareフルスタックプロジェクトを生成するスクリプト。
 *
 * 実行内容:
 *   1. テンプレート(gitトラック済みファイル)を指定ディレクトリへコピーし、固有値を置換
 *   2. wrangler CLIでアカウントIDを確認し、D1データベース・R2バケット(dev/prd)を新規作成
 *   3. dev環境を workers.dev 上にデプロイして即動作する状態にする
 *   4. gh CLIでGitHubリポジトリを新規作成してpush
 *
 * 使い方:
 *   node scripts/create-project.mjs <project-name> [options]
 *   node scripts/create-project.mjs --check
 *
 * オプション:
 *   --check                      オフライン整合性検査のみ実行(後述)
 *   --dir <path>                 作成先ディレクトリ (デフォルト: ../<project-name>)
 *   --public                     GitHubリポジトリをpublicで作成 (デフォルト: private)
 *   --no-github                  GitHubリポジトリの作成をスキップ
 *   --google-client-id <id>      Google OAuth クライアントID
 *   --google-client-secret <s>   Google OAuth クライアントシークレット
 *   --yes                        対話プロンプトをすべてスキップ(OAuth未設定で続行)
 *   --help                       ヘルプを表示
 *
 * ## --check モード(テンプレート整合性検査)
 * Cloudflare/GitHub/ネットワークに一切触れず、作業ツリーをダミー値で変換して
 * 「将来のコード変更でこのスクリプトが壊れていないか」を数秒で検査する。
 * `pnpm template:check` として check-all に組み込まれており、以下を検知する:
 *   - 置換トークン(todo-back 等)のリネーム・削除による置換漏れ
 *   - wrangler.jsonc の構造変更による正規表現のミスマッチ
 *   - 新たに追加されたプロジェクト固有値(totakn.com 等)の置換漏れ
 *
 * 前提条件(生成実行時):
 *   - pnpm / gh / git がインストール済み
 *   - `wrangler login` 済み(コピー先の wrangler を利用するため事前ログインのみ必要)
 *   - `gh auth login` 済み(--no-github 指定時は不要)
 */

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

/** テンプレートリポジトリのルートディレクトリ */
const TEMPLATE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/** 置換時に走査をスキップするディレクトリ名 */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".wrangler",
  ".react-router",
]);

// ---------------------------------------------------------------------------
// 置換トークン定義(テンプレート固有値の一覧)
//
// このスクリプトの生命線。テンプレート側でこれらのリテラルをリネームした場合、
// `pnpm template:check` が失敗して教えてくれる(applyReplacementsStrict が
// 1件もマッチしないトークンを検出するため)。
// ---------------------------------------------------------------------------

/**
 * 名前系の置換トークンを生成する(リソース名・パッケージ名・Cookieプレフィックス等)。
 * 注意: 裸の "todo" はアプリ本体のコード(Todoエンティティ等)を壊すため置換しない。
 * @param {string} name - 新プロジェクト名(kebab-case)
 * @returns {Array<[string, string]>} [置換元, 置換先] のペア一覧(先頭から順に適用)
 */
function buildNameReplacements(name) {
  return [
    ["todo-app-db-", `${name}-db-`],
    ["todo-app-storage-", `${name}-storage-`],
    ["todo-back", `${name}-back`],
    ["todo-front", `${name}-front`],
    ["Claudeflare Todo", name],
    ["cloudflare-todo", name],
  ];
}

/**
 * 新プロジェクトの workers.dev ホスト名一覧を生成する
 * @param {string} name - 新プロジェクト名
 * @param {string} sub - workers.dev のアカウントサブドメイン
 * @returns {{backDev: string, backPrd: string, frontDev: string, frontPrd: string}}
 */
function buildHosts(name, sub) {
  return {
    backDev: `${name}-back-dev.${sub}.workers.dev`,
    backPrd: `${name}-back-prd.${sub}.workers.dev`,
    frontDev: `${name}-front-dev.${sub}.workers.dev`,
    frontPrd: `${name}-front-prd.${sub}.workers.dev`,
  };
}

/**
 * URL系の置換トークンを生成する(テンプレートのドメイン → workers.dev URL)。
 * 長いトークンから順に並べること(api.* を先に置換しないと壊れる)。
 * @param {ReturnType<typeof buildHosts>} hosts - 新プロジェクトのホスト名一覧
 * @returns {Array<[string, string]>} [置換元, 置換先] のペア一覧
 */
function buildUrlReplacements(hosts) {
  return [
    ["api.todo.dev.totakn.com", hosts.backDev],
    ["api.todo.totakn.com", hosts.backPrd],
    ["todo.dev.totakn.com", hosts.frontDev],
    ["todo.totakn.com", hosts.frontPrd],
  ];
}

/**
 * 変換後に1件も残っていてはならないテンプレート固有文字列。
 * --check モードで残存を検査する。新たな固有値(ドメイン・リソース名など)を
 * テンプレートに追加する場合は、既存の命名パターンを踏襲するかこの一覧に追加すること。
 */
const FORBIDDEN_LEFTOVERS = [
  "totakn.com",
  "cloudflare-todo",
  "todo-back",
  "todo-front",
  "todo-app-db",
  "todo-app-storage",
  "Claudeflare",
];

// ---------------------------------------------------------------------------
// 汎用ユーティリティ
// ---------------------------------------------------------------------------

/**
 * コマンドを実行し、出力をそのままターミナルに流す
 * @param {string} cmd - 実行するシェルコマンド
 * @param {object} [opts] - execSync に渡す追加オプション(cwd など)
 */
function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

/**
 * コマンドを実行し、標準出力を文字列で取得する(出力は画面にも表示する)
 * @param {string} cmd - 実行するシェルコマンド
 * @param {object} [opts] - execSync に渡す追加オプション(cwd, input など)
 * @returns {string} コマンドの標準出力
 */
function capture(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  const out = execSync(cmd, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "inherit"],
    ...opts,
  });
  process.stdout.write(out);
  return out;
}

/**
 * コマンドライン引数をパースする
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {{name: string|undefined, dir: string|undefined, isPublic: boolean, github: boolean, googleClientId: string, googleClientSecret: string, yes: boolean, check: boolean, help: boolean}}
 */
function parseArgs(argv) {
  const args = {
    name: undefined,
    dir: undefined,
    isPublic: false,
    github: true,
    googleClientId: "",
    googleClientSecret: "",
    yes: false,
    check: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") args.dir = argv[++i];
    else if (a === "--public") args.isPublic = true;
    else if (a === "--no-github") args.github = false;
    else if (a === "--google-client-id") args.googleClientId = argv[++i] ?? "";
    else if (a === "--google-client-secret")
      args.googleClientSecret = argv[++i] ?? "";
    else if (a === "--yes") args.yes = true;
    else if (a === "--check") args.check = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (!a.startsWith("-") && !args.name) args.name = a;
    else throw new Error(`不明な引数: ${a}`);
  }
  return args;
}

/**
 * ディレクトリ配下の全ファイルパスを再帰的に列挙する(SKIP_DIRS は除外)
 * @param {string} dir - 走査するディレクトリ
 * @returns {string[]} ファイルの絶対パス一覧
 */
function walkFiles(dir) {
  /** @type {string[]} */
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name))
        result.push(...walkFiles(path.join(dir, entry.name)));
    } else if (entry.isFile()) {
      result.push(path.join(dir, entry.name));
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// テンプレート変換処理(実行モードと --check モードで共有)
// ---------------------------------------------------------------------------

/**
 * ディレクトリ配下の全テキストファイルに対して順序付きリテラル置換を適用する。
 * バイナリファイル(NULバイトを含むファイル)はスキップする。
 * @param {string} root - 置換対象のルートディレクトリ
 * @param {Array<[string, string]>} replacements - [置換元, 置換先] のペア一覧(先頭から順に適用)
 * @returns {Map<string, number>} 置換元トークン → 置換が発生したファイル数
 */
function replaceInTree(root, replacements) {
  /** @type {Map<string, number>} */
  const counts = new Map(replacements.map(([from]) => [from, 0]));
  for (const file of walkFiles(root)) {
    const buf = fs.readFileSync(file);
    if (buf.includes(0)) continue;
    const original = buf.toString("utf8");
    let content = original;
    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        counts.set(from, counts.get(from) + 1);
        content = content.split(from).join(to);
      }
    }
    if (content !== original) fs.writeFileSync(file, content);
  }
  return counts;
}

/**
 * replaceInTree を実行し、1件もマッチしなかったトークンがあればエラーにする。
 * テンプレート側でトークンがリネーム・削除された場合のサイレントな置換漏れを防ぐ。
 * @param {string} root - 置換対象のルートディレクトリ
 * @param {Array<[string, string]>} replacements - [置換元, 置換先] のペア一覧
 */
function applyReplacementsStrict(root, replacements) {
  const counts = replaceInTree(root, replacements);
  const missing = [...counts.entries()]
    .filter(([, n]) => n === 0)
    .map(([from]) => from);
  if (missing.length > 0) {
    throw new Error(
      `置換トークンがテンプレート内に1件も見つかりません(リネームされた場合はスクリプトのトークン定義を更新してください): ${missing.join(", ")}`,
    );
  }
}

/**
 * ディレクトリ・ファイル名自体に含まれる固有値をリネームする(深い階層から順に処理)
 * @param {string} root - 対象のルートディレクトリ
 * @param {Array<[string, string]>} replacements - [置換元, 置換先] のペア一覧
 */
function renameEntries(root, replacements) {
  /** @type {string[]} */
  const entries = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      const p = path.join(dir, entry.name);
      entries.push(p);
      if (entry.isDirectory()) collect(p);
    }
  };
  collect(root);
  // 子を先にリネームするため深い階層順にソート
  entries.sort((a, b) => b.length - a.length);
  for (const p of entries) {
    let newName = path.basename(p);
    for (const [from, to] of replacements)
      newName = newName.split(from).join(to);
    if (newName !== path.basename(p))
      fs.renameSync(p, path.join(path.dirname(p), newName));
  }
}

/**
 * wrangler.jsonc 内の `"routes": [...]` ブロックを `"workers_dev": true` に置き換える。
 * カスタムドメインなしで workers.dev 上に即デプロイできるようにするための変換。
 * routesブロックが1つも見つからない場合(構造変更された場合)はエラーにする。
 * @param {string} file - wrangler.jsonc のパス
 */
function convertRoutesToWorkersDev(file) {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/"routes":\s*\[[\s\S]*?\],/g);
  if (!matches) {
    throw new Error(
      `${file} に "routes" ブロックが見つかりません(wrangler.jsoncの構造が変更された場合はスクリプトを更新してください)`,
    );
  }
  fs.writeFileSync(
    file,
    content.replace(/"routes":\s*\[[\s\S]*?\],/g, '"workers_dev": true,'),
  );
}

/**
 * wrangler.jsonc のトップレベル name の直後に account_id を注入する
 * @param {string} file - wrangler.jsonc のパス
 * @param {string} topLevelName - トップレベルの name の値(例: "myapp-back")
 * @param {string} accountId - CloudflareアカウントID
 */
function injectAccountId(file, topLevelName, accountId) {
  const content = fs.readFileSync(file, "utf8");
  const marker = `"name": "${topLevelName}",`;
  if (!content.includes(marker))
    throw new Error(`${file} に ${marker} が見つかりません`);
  fs.writeFileSync(
    file,
    content.replace(marker, `${marker}\n  "account_id": "${accountId}",`),
  );
}

/**
 * wrangler.jsonc 内で指定したD1データベース名に対応する database_id を書き換える
 * @param {string} file - wrangler.jsonc のパス
 * @param {string} dbName - database_name の値
 * @param {string} dbId - 設定する database_id
 */
function setDatabaseId(file, dbName, dbId) {
  const content = fs.readFileSync(file, "utf8");
  const pattern = new RegExp(
    `("database_name": "${dbName}",\\s*"database_id": ")[^"]+(")`,
  );
  if (!pattern.test(content))
    throw new Error(
      `${file} に database_name=${dbName} のブロックが見つかりません`,
    );
  fs.writeFileSync(file, content.replace(pattern, `$1${dbId}$2`));
}

/**
 * コピー先の back/front の wrangler.jsonc のパスを返す
 * @param {string} dest - コピー先ディレクトリ
 * @returns {{back: string, front: string}}
 */
function wranglerPaths(dest) {
  return {
    back: path.join(dest, "workspaces", "back", "wrangler.jsonc"),
    front: path.join(dest, "workspaces", "front", "wrangler.jsonc"),
  };
}

/**
 * 変換フェーズ1: 名前系の置換(リソース名・Cookieプレフィックス等)、
 * ファイル名リネーム、routes→workers.dev化、local D1のダミーUUID採番を行う。
 * URL系の置換は workers.dev サブドメイン確定後の applyUrlPhase で行う。
 * @param {string} dest - コピー先ディレクトリ
 * @param {string} name - 新プロジェクト名
 */
function applyNamePhase(dest, name) {
  const replacements = buildNameReplacements(name);
  applyReplacementsStrict(dest, replacements);
  renameEntries(dest, replacements);

  const wrangler = wranglerPaths(dest);
  convertRoutesToWorkersDev(wrangler.back);
  convertRoutesToWorkersDev(wrangler.front);
  // local環境のD1はローカルシミュレーションのみのため、ダミーUUIDを新規採番
  setDatabaseId(wrangler.back, `${name}-db-local`, crypto.randomUUID());
}

/**
 * 変換フェーズ2: URL系の置換(テンプレートのドメイン → workers.dev URL)と、
 * 認証Cookie共有用の DOMAIN 差し替えを行う。
 * DOMAINはfront/backワーカー両方の親ドメイン(<sub>.workers.dev)にする必要がある
 * (workers.devはPublic Suffixのため <sub>.workers.dev が登録可能ドメインとなりCookie設定可能)。
 * @param {string} dest - コピー先ディレクトリ
 * @param {string} name - 新プロジェクト名
 * @param {string} sub - workers.dev のアカウントサブドメイン
 * @returns {ReturnType<typeof buildHosts>} 確定したホスト名一覧
 */
function applyUrlPhase(dest, name, sub) {
  const hosts = buildHosts(name, sub);
  applyReplacementsStrict(dest, buildUrlReplacements(hosts));
  applyReplacementsStrict(dest, [
    [`"DOMAIN": "${hosts.frontDev}"`, `"DOMAIN": "${sub}.workers.dev"`],
    [`"DOMAIN": "${hosts.frontPrd}"`, `"DOMAIN": "${sub}.workers.dev"`],
  ]);
  return hosts;
}

// ---------------------------------------------------------------------------
// --check モード(オフライン整合性検査)
// ---------------------------------------------------------------------------

/**
 * 作業ツリー(gitignore対象を除く全ファイル)を一時ディレクトリにコピーする。
 * 実行モードの git archive と異なり未コミットの変更・新規ファイルも対象にすることで、
 * コミット前のタスク完了チェック時点で問題を検知できるようにする。
 * @returns {string} コピー先の一時ディレクトリ
 */
function copyWorkingTreeToTemp() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "template-check-"));
  const fileList = execSync("git ls-files --cached --others --exclude-standard", {
    cwd: TEMPLATE_ROOT,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  for (const rel of fileList) {
    // 実行モードと同様に、テンプレート専用のscripts/とローカルシークレットは対象外
    if (rel.startsWith("scripts/") || path.basename(rel) === ".dev.vars")
      continue;
    const src = path.join(TEMPLATE_ROOT, rel);
    if (!fs.existsSync(src)) continue; // 削除済みだがgitに残っているファイル
    const target = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(src, target);
  }
  return tmp;
}

/**
 * 検査用アサーション: 条件を満たさない場合はエラー一覧に追加する
 * @param {string[]} errors - エラーメッセージの収集先
 * @param {boolean} cond - 満たすべき条件
 * @param {string} message - 失敗時のメッセージ
 */
function check(errors, cond, message) {
  if (!cond) errors.push(message);
}

/**
 * --check モード本体: 作業ツリーをダミー値で変換し、置換漏れ・構造不整合を検査する。
 * Cloudflare/GitHub/ネットワークには一切アクセスしない。
 * @returns {boolean} 検査に合格したかどうか
 */
function runCheck() {
  const name = "check-dummy";
  const sub = "example";
  const dummyAccountId = "0123456789abcdef0123456789abcdef";
  const dummyDbId = (stage) => `00000000-0000-0000-0000-00000000000${stage}`;

  console.log("テンプレート整合性検査(--check)を開始します...");
  const tmp = copyWorkingTreeToTemp();
  /** @type {string[]} */
  const errors = [];
  try {
    // 実行モードと同じ変換を同じ順序で適用(マッチ漏れは各関数がthrowする)
    applyNamePhase(tmp, name);
    const wrangler = wranglerPaths(tmp);
    setDatabaseId(wrangler.back, `${name}-db-dev`, dummyDbId(1));
    setDatabaseId(wrangler.back, `${name}-db-prd`, dummyDbId(2));
    injectAccountId(wrangler.back, `${name}-back`, dummyAccountId);
    injectAccountId(wrangler.front, `${name}-front`, dummyAccountId);
    applyUrlPhase(tmp, name, sub);

    // 検査1: テンプレート固有文字列がファイル内容に残存していないこと
    for (const file of walkFiles(tmp)) {
      const buf = fs.readFileSync(file);
      if (buf.includes(0)) continue;
      const content = buf.toString("utf8");
      for (const token of FORBIDDEN_LEFTOVERS) {
        check(
          errors,
          !content.includes(token),
          `置換漏れ: ${path.relative(tmp, file)} に "${token}" が残っています。` +
            "新しい固有値を追加した場合は既存の命名パターンに合わせるか、スクリプトのトークン定義を更新してください",
        );
      }
    }
    // 検査2: ファイル・ディレクトリ名に固有文字列が残存していないこと
    for (const file of walkFiles(tmp)) {
      const rel = path.relative(tmp, file);
      for (const token of FORBIDDEN_LEFTOVERS) {
        check(
          errors,
          !rel.includes(token),
          `パス名の置換漏れ: ${rel} に "${token}" が含まれています`,
        );
      }
    }
    // 検査3: wrangler.jsonc の構造検証
    for (const [label, file] of Object.entries(wranglerPaths(tmp))) {
      const content = fs.readFileSync(file, "utf8");
      check(
        errors,
        !content.includes('"routes"'),
        `${label}/wrangler.jsonc に "routes" が残っています(workers.dev化に失敗)`,
      );
      const workersDevCount = (content.match(/"workers_dev": true/g) ?? [])
        .length;
      check(
        errors,
        workersDevCount === 2,
        `${label}/wrangler.jsonc の "workers_dev": true が dev/prd の2箇所ではなく${workersDevCount}箇所です`,
      );
      check(
        errors,
        content.includes(dummyAccountId),
        `${label}/wrangler.jsonc に account_id が注入されていません`,
      );
    }
    const backContent = fs.readFileSync(wranglerPaths(tmp).back, "utf8");
    const domainCount = (
      backContent.match(
        new RegExp(`"DOMAIN": "${sub}\\.workers\\.dev"`, "g"),
      ) ?? []
    ).length;
    check(
      errors,
      domainCount === 2,
      `back/wrangler.jsonc のCookie共有用 "DOMAIN": "${sub}.workers.dev" が dev/prd の2箇所ではなく${domainCount}箇所です`,
    );
    check(
      errors,
      backContent.includes(dummyDbId(1)) && backContent.includes(dummyDbId(2)),
      "back/wrangler.jsonc に dev/prd の database_id が反映されていません",
    );
  } catch (err) {
    errors.push(err.message);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  if (errors.length > 0) {
    console.error(
      `\n❌ テンプレート整合性検査に失敗しました(${errors.length}件):`,
    );
    for (const e of errors) console.error(`  - ${e}`);
    return false;
  }
  console.log(
    "✅ テンプレート整合性検査OK: create-project.mjs は現在のコードベースに対して正常に動作します",
  );
  return true;
}

// ---------------------------------------------------------------------------
// 実行モードのヘルパー
// ---------------------------------------------------------------------------

/**
 * `wrangler whoami` の出力からアカウントID(32桁hex)を抽出する
 * @param {string} output - wrangler whoami の標準出力
 * @returns {Array<{label: string, id: string}>} 検出されたアカウント一覧
 */
function parseAccounts(output) {
  /** @type {Array<{label: string, id: string}>} */
  const accounts = [];
  for (const line of output.split("\n")) {
    const m = line.match(/\b([0-9a-f]{32})\b/);
    if (m)
      accounts.push({ label: line.replace(/[│|]/g, " ").trim(), id: m[1] });
  }
  return accounts;
}

/**
 * dev環境のWorkerへシークレットを設定する(stdin経由で非対話投入)
 * @param {string} backDir - バックエンドワークスペースのパス
 * @param {string} key - シークレット名
 * @param {string} value - シークレット値
 */
function putDevSecret(backDir, key, value) {
  console.log(`\n$ wrangler secret put ${key} -e dev  (値はstdin経由)`);
  execSync(`pnpm exec wrangler secret put ${key} -e dev`, {
    cwd: backDir,
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
  });
}

/** メイン処理 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.check) {
    process.exit(runCheck() ? 0 : 1);
  }
  if (args.help || !args.name) {
    console.log(
      "使い方: node scripts/create-project.mjs <project-name> [--dir <path>] [--public] [--no-github] [--google-client-id <id>] [--google-client-secret <secret>] [--yes]\n" +
        "        node scripts/create-project.mjs --check  (オフライン整合性検査のみ)",
    );
    process.exit(args.help ? 0 : 1);
  }

  const name = args.name;
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name)) {
    throw new Error(
      `プロジェクト名はkebab-case(小文字英数字とハイフン)で指定してください: ${name}`,
    );
  }
  if (name.length > 40) {
    throw new Error(
      "プロジェクト名が長すぎます(Worker名がDNSラベル上限を超えるため40文字以内にしてください)",
    );
  }

  const dest = path.resolve(args.dir ?? path.join(TEMPLATE_ROOT, "..", name));
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
    throw new Error(`作成先ディレクトリが空ではありません: ${dest}`);
  }

  // ---- 0. 前提チェックとOAuth対話入力 ----
  for (const cmd of ["git --version", "pnpm --version", "tar --version"]) {
    execSync(cmd, { stdio: "ignore" });
  }
  if (args.github) {
    try {
      execSync("gh auth status", { stdio: "ignore" });
    } catch {
      throw new Error(
        "gh CLIが未認証です。`gh auth login` を実行するか --no-github を指定してください",
      );
    }
  }

  let { googleClientId, googleClientSecret } = args;
  if (!googleClientId && !args.yes && process.stdin.isTTY) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(
      "\nGoogle OAuth の認証情報を入力してください(空Enterでスキップし、後から設定できます)",
    );
    googleClientId = (await rl.question("GOOGLE_CLIENT_ID: ")).trim();
    if (googleClientId) {
      googleClientSecret = (await rl.question("GOOGLE_CLIENT_SECRET: ")).trim();
    }
    rl.close();
  }

  /** 失敗時の手動クリーンアップ案内用に、作成済みCloudflareリソースを記録する */
  const createdResources = [];

  try {
    // ---- 1. テンプレートコピー(gitトラック済みファイルのみ) ----
    console.log(`\n=== 1/8 テンプレートを ${dest} にコピー ===`);
    // git archive HEAD はコミット済みの内容のみコピーするため、未コミット変更があれば警告する
    const dirty = capture("git status --porcelain", {
      cwd: TEMPLATE_ROOT,
    }).trim();
    if (dirty) {
      console.warn(
        "⚠️  テンプレートに未コミットの変更があります。これらは新プロジェクトに含まれません:",
      );
      console.warn(
        dirty
          .split("\n")
          .slice(0, 10)
          .map((l) => `    ${l}`)
          .join("\n"),
      );
    }
    fs.mkdirSync(dest, { recursive: true });
    // dest はユーザー入力のためシェル文字列に直接補間せず、環境変数経由で渡す
    run('git archive HEAD | tar -x -C "$CREATE_PROJECT_DEST"', {
      cwd: TEMPLATE_ROOT,
      env: { ...process.env, CREATE_PROJECT_DEST: dest },
    });
    // 生成後のプロジェクトはテンプレートではないため、本スクリプト自身は含めない
    fs.rmSync(path.join(dest, "scripts", "create-project.mjs"), {
      force: true,
    });
    const destScriptsDir = path.join(dest, "scripts");
    if (
      fs.existsSync(destScriptsDir) &&
      fs.readdirSync(destScriptsDir).length === 0
    ) {
      fs.rmdirSync(destScriptsDir);
    }

    // ---- 2. 名前系の固有値置換(URL系はworkers.devサブドメイン確定後に実施) ----
    console.log("\n=== 2/8 プロジェクト固有値の置換 ===");
    applyNamePhase(dest, name);
    const wrangler = wranglerPaths(dest);

    // ---- 3. .dev.vars 生成 ----
    console.log("\n=== 3/8 .dev.vars 生成 ===");
    const localAuthSecret = crypto.randomBytes(24).toString("base64url");
    fs.writeFileSync(
      path.join(dest, "workspaces", "back", ".dev.vars"),
      [
        `BETTER_AUTH_SECRET=${localAuthSecret}`,
        "BETTER_AUTH_URL=http://localhost:5173",
        `GOOGLE_CLIENT_ID=${googleClientId || "YOUR_GOOGLE_CLIENT_ID"}`,
        `GOOGLE_CLIENT_SECRET=${googleClientSecret || "YOUR_GOOGLE_CLIENT_SECRET"}`,
        "",
      ].join("\n"),
    );

    // ---- 4. 依存インストールとCloudflareアカウント確認 ----
    console.log("\n=== 4/8 pnpm install と Cloudflareアカウント確認 ===");
    run("pnpm install", { cwd: dest });

    const backDir = path.join(dest, "workspaces", "back");
    let whoamiOut = "";
    try {
      whoamiOut = capture("pnpm exec wrangler whoami", { cwd: backDir });
    } catch {
      // 未ログイン時は wrangler whoami が非ゼロ終了する
    }
    const accounts = parseAccounts(whoamiOut);
    if (accounts.length === 0) {
      throw new Error(
        "wranglerが未ログインです。`pnpm --filter back exec wrangler login` を実行してから再実行してください",
      );
    }
    let accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? accounts[0].id;
    if (accounts.length > 1 && !process.env.CLOUDFLARE_ACCOUNT_ID) {
      if (args.yes || !process.stdin.isTTY) {
        console.log(
          `複数アカウントが見つかったため先頭を使用します: ${accounts[0].label}`,
        );
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        accounts.forEach((a, i) => console.log(`  [${i}] ${a.label}`));
        const idx = Number(
          (await rl.question("使用するアカウント番号: ")).trim(),
        );
        rl.close();
        if (!Number.isInteger(idx) || !accounts[idx])
          throw new Error("不正なアカウント番号です");
        accountId = accounts[idx].id;
      }
    }
    console.log(`アカウントID: ${accountId}`);
    injectAccountId(wrangler.back, `${name}-back`, accountId);
    injectAccountId(wrangler.front, `${name}-front`, accountId);
    const wranglerEnv = { ...process.env, CLOUDFLARE_ACCOUNT_ID: accountId };

    // ---- 5. Cloudflareリソース作成(D1 / R2)とマイグレーション ----
    console.log("\n=== 5/8 D1データベース・R2バケット作成 ===");
    for (const stage of ["dev", "prd"]) {
      run(`pnpm exec wrangler d1 create ${name}-db-${stage}`, {
        cwd: backDir,
        env: wranglerEnv,
      });
      createdResources.push(
        `D1: ${name}-db-${stage} (削除: wrangler d1 delete ${name}-db-${stage})`,
      );
      run(`pnpm exec wrangler r2 bucket create ${name}-storage-${stage}`, {
        cwd: backDir,
        env: wranglerEnv,
      });
      createdResources.push(
        `R2: ${name}-storage-${stage} (削除: wrangler r2 bucket delete ${name}-storage-${stage})`,
      );
    }
    const d1ListOut = capture("pnpm exec wrangler d1 list --json", {
      cwd: backDir,
      env: wranglerEnv,
    });
    const d1List = JSON.parse(d1ListOut.slice(d1ListOut.indexOf("[")));
    for (const stage of ["dev", "prd"]) {
      const db = d1List.find((d) => d.name === `${name}-db-${stage}`);
      if (!db?.uuid)
        throw new Error(`d1 list の結果に ${name}-db-${stage} が見つかりません`);
      setDatabaseId(wrangler.back, `${name}-db-${stage}`, db.uuid);
    }
    run(
      `pnpm exec wrangler d1 migrations apply ${name}-db-dev --remote -e dev`,
      { cwd: backDir, env: wranglerEnv },
    );

    // ---- 6. devデプロイ(2パス: 初回デプロイでworkers.devサブドメインを確定) ----
    console.log("\n=== 6/8 dev環境デプロイ ===");
    const deployOut = capture("pnpm exec wrangler deploy --minify -e dev", {
      cwd: backDir,
      env: wranglerEnv,
    });
    createdResources.push(
      `Worker: ${name}-back-dev (削除: wrangler delete -e dev ※backで実行)`,
    );
    const urlMatch = deployOut.match(
      new RegExp(`https://${name}-back-dev\\.([a-z0-9-]+)\\.workers\\.dev`),
    );
    let sub = urlMatch?.[1];
    if (!sub) {
      if (args.yes || !process.stdin.isTTY)
        throw new Error(
          "デプロイ出力からworkers.devサブドメインを特定できませんでした",
        );
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      sub = (
        await rl.question(
          "workers.devのアカウントサブドメイン(<sub>.workers.dev の <sub>): ",
        )
      ).trim();
      rl.close();
    }
    console.log(`workers.devサブドメイン: ${sub}.workers.dev`);

    const hosts = applyUrlPhase(dest, name, sub);

    // dev環境のシークレット設定
    putDevSecret(
      backDir,
      "BETTER_AUTH_SECRET",
      crypto.randomBytes(24).toString("base64url"),
    );
    putDevSecret(backDir, "BETTER_AUTH_URL", `https://${hosts.frontDev}`);
    if (googleClientId) {
      putDevSecret(backDir, "GOOGLE_CLIENT_ID", googleClientId);
      putDevSecret(backDir, "GOOGLE_CLIENT_SECRET", googleClientSecret);
    }

    // 確定したURL設定で back を再デプロイし、front をデプロイ
    // (front のビルドは back の dist/types に依存するため先に typecheck で型を生成)
    run("pnpm b typecheck", { cwd: dest });
    run("pnpm exec wrangler deploy --minify -e dev", {
      cwd: backDir,
      env: wranglerEnv,
    });
    run("pnpm run deploy:dev", {
      cwd: path.join(dest, "workspaces", "front"),
      env: wranglerEnv,
    });
    createdResources.push(
      `Worker: ${name}-front-dev (削除: wrangler delete -e dev ※frontで実行)`,
    );

    // ---- 7. 型再生成と検証 ----
    console.log("\n=== 7/8 型再生成と検証 ===");
    run("pnpm typecheck", { cwd: dest });

    // ---- 8. GitHubリポジトリ作成 ----
    console.log("\n=== 8/8 git初期化とGitHubリポジトリ作成 ===");
    run("git init -b main", { cwd: dest });
    run("git add -A", { cwd: dest });
    run(
      `git commit -m "Initial commit (generated from cloudflare-todo template)"`,
      { cwd: dest },
    );
    if (args.github) {
      run(
        `gh repo create ${name} --${args.isPublic ? "public" : "private"} --source . --push`,
        { cwd: dest },
      );
    }

    // ---- 完了サマリー ----
    const oauthNote = googleClientId
      ? `  - Google Cloud Console で承認済みリダイレクトURIに以下を追加:
      http://localhost:8787/api/auth/callback/google
      https://${hosts.backDev}/api/auth/callback/google`
      : `  - Google OAuth未設定のためログインはまだ動きません。Google Cloud ConsoleでOAuthクライアントを作成し、
    承認済みリダイレクトURIに以下を登録:
      http://localhost:8787/api/auth/callback/google
      https://${hosts.backDev}/api/auth/callback/google
    その後、workspaces/back/.dev.vars の GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET を実値に書き換え、
    dev環境にも設定:
      cd workspaces/back
      pnpm exec wrangler secret put GOOGLE_CLIENT_ID -e dev
      pnpm exec wrangler secret put GOOGLE_CLIENT_SECRET -e dev`;

    console.log(`
========================================
✅ プロジェクト ${name} の生成が完了しました

  ディレクトリ : ${dest}
  Front (dev)  : https://${hosts.frontDev}
  Back  (dev)  : https://${hosts.backDev}
  ${args.github ? `GitHub       : gh repo view ${name} --web で確認できます` : "GitHub       : 未作成(--no-github指定)"}

📝 残りの手動セットアップ:
${oauthNote}

  - prd環境のデプロイ(任意):
      pnpm exec wrangler d1 migrations apply ${name}-db-prd --remote -e prd
      pnpm exec wrangler secret put BETTER_AUTH_SECRET -e prd   # 他のシークレットも同様
      pnpm b deploy:prd && pnpm f deploy:prd

  - カスタムドメイン移行(任意):
      workspaces/*/wrangler.jsonc の "workers_dev": true を "routes" 設定に戻し、
      workspaces/front/app/utils/env.ts のURLを差し替える
========================================`);
  } catch (err) {
    console.error(`\n❌ エラーが発生しました: ${err.message}`);
    if (createdResources.length > 0) {
      console.error(
        "\n途中まで作成されたCloudflareリソース(不要なら手動で削除してください):",
      );
      for (const r of createdResources) console.error(`  - ${r}`);
    }
    console.error(`\n作成途中のディレクトリ: ${dest}`);
    process.exit(1);
  }
}

await main();
