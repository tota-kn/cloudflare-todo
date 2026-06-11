import { createHmac } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * BetterAuthのセッションCookie名（バックエンドの cookiePrefix "cloudflare-todo" に対応）
 */
const SESSION_COOKIE_NAME = "cloudflare-todo.session_token";

/**
 * シードデータ（workspaces/back/migrations/0002_seed_test_data.sql）の
 * test-user-001 に紐づく固定セッショントークン
 */
const TEST_SESSION_TOKEN = "test-session-token-001";

/**
 * バックエンドの .dev.vars から BETTER_AUTH_SECRET を読み取る
 *
 * @returns ローカル環境のBetterAuth署名用シークレット
 * @throws .dev.vars が存在しない、または BETTER_AUTH_SECRET が未定義の場合
 */
function readBetterAuthSecret(): string {
  const devVarsPath = path.resolve(__dirname, "../../back/.dev.vars");
  const content = readFileSync(devVarsPath, "utf-8");
  const match = content.match(/^BETTER_AUTH_SECRET=(.+)$/m);
  if (!match) {
    throw new Error(`BETTER_AUTH_SECRET が ${devVarsPath} に見つかりません`);
  }
  return match[1].trim();
}

/**
 * セッショントークンからBetterAuthが検証可能な署名済みCookie値を生成する
 *
 * better-call の signCookieValue と同じ形式:
 * encodeURIComponent(`${token}.${base64(HMAC-SHA256(token, secret))}`)
 *
 * @param token - DBにシード済みのセッショントークン
 * @param secret - BETTER_AUTH_SECRET
 * @returns Cookieに設定する署名済み値
 */
function signSessionToken(token: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(token).digest("base64");
  return encodeURIComponent(`${token}.${signature}`);
}

/**
 * 指定トークンのログイン状態を再現するPlaywright storageStateファイルを書き出す
 *
 * @param token - DBにシード済みのセッショントークン
 * @param secret - BETTER_AUTH_SECRET
 * @param outputPath - storageState JSONの出力先パス
 */
function writeStorageState(
  token: string,
  secret: string,
  outputPath: string,
): void {
  const storageState = {
    cookies: [
      {
        name: SESSION_COOKIE_NAME,
        value: signSessionToken(token, secret),
        domain: "localhost",
        path: "/",
        expires: -1,
        httpOnly: true,
        secure: false,
        sameSite: "Lax" as const,
      },
    ],
    origins: [],
  };
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(storageState, null, 2));
}

/**
 * Playwright globalSetup
 *
 * 実際のGoogle OAuthを経由せず、シード済みセッション（pnpm b db:reset で投入）の
 * Cookieを直接生成してログイン状態を再現する。
 * 生成した storageState は playwright.config.ts の use.storageState で全テストに適用される。
 */
export default function globalSetup(): void {
  const secret = readBetterAuthSecret();
  writeStorageState(
    TEST_SESSION_TOKEN,
    secret,
    path.resolve(__dirname, "../tests/.auth/user.json"),
  );
}
