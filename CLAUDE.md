# CLAUDE.md

Cloudflare Workers で Web サービスを作るときのひな形。題材として Todo アプリを実装している。

## 方針

デプロイ先で継続的に使われているサービスではない。ひな形を最新に保つことを優先する。

- 後方互換は考えない。API・DB スキーマ・設定は、移行措置や旧形式との両対応を入れずに書き換える
- ツールやライブラリの推奨構成が変わったら追従する。非推奨になった書き方は残さず新しい書き方に置き換える
- 追従を見送るときは、理由をメモリかコミットログに残す（例: 新ツールの非互換）

## 構成

pnpm ワークスペースのモノレポ。各ワークスペースの詳細は個別の CLAUDE.md を参照：

- **workspaces/back/**: Hono API サーバー（Cloudflare Workers）— オニオンアーキテクチャ
- **workspaces/front/**: React Router v8 SSR アプリ（Cloudflare Workers）— TanStack Query + i18n
- **workspaces/e2e/**: Playwright E2E テスト

## 開発コマンド

```bash
scripts/claude.sh         # devcontainer を起動（無ければ作成）してその中で Claude Code を起動
pnpm install              # Node / pnpm のバージョンは mise.toml で固定

pnpm b [command]          # バックエンドへ委譲（例: pnpm b dev）
pnpm f [command]          # フロントエンドへ委譲
pnpm e2e [command]        # E2E へ委譲

pnpm lint / pnpm fmt      # vp lint --fix / vp fmt
pnpm knip                 # 未使用のファイル・export・依存を検出（設定は knip.json）
pnpm typegen              # 生成型（wrangler / back の dist/types / react-router）を作る。postinstall でも実行
pnpm typecheck            # typegen → 型チェック
pnpm test:unit            # back + front の単体テスト
pnpm test:api             # API 統合テスト（Bruno、DB/バケットをリセット）
pnpm test:e2e             # DB リセット → E2E テスト
pnpm check-all            # CI 相当の全チェック
```

## タスク完了時のチェック

lint・fmt・型・knip・単体テストは Claude Code の hooks（`.claude/hooks/`）が自動で実行し、失敗すれば差し戻す。DB をリセットする次の 2 つは hooks では実行しないので、必要なら手動で流す。

- `pnpm test:api` — API を変えたとき
- `pnpm test:e2e` — UI を変えたとき

## アーキテクチャ概要

### 型共有

1. バックエンド: `workspaces/back/src/presentation/app.ts` が `AppType` をエクスポート
2. フロントエンド: `workspaces/front/app/types/shared.ts` が `back/dist/types/` から `ClientType = AppType` として取り込む
3. フロントエンド: `hc<ClientType>()` で型付き API クライアントを生成
4. バックエンドの型を変えたら `pnpm b typegen` で `dist/types` を再生成する

### 環境

両アプリは `workspaces/*/wrangler.jsonc` の環境別設定を使う：

- **local**: back:8787, front:5173
- **dev**: `https://todo.dev.totakn.com`
- **prd**: `https://todo.totakn.com`

### 認証

BetterAuth + Google OAuth。セッションはバックエンドで管理し、フロントエンドの認証必須ルートは `requireAuth()` で未認証時にログインページへリダイレクトする。

## 注意点

- ローカルサーバは手動で起動済み。動作確認時に起動しなおさない
- TSDoc を必ず書く
