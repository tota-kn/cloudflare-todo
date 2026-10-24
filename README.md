# cloudflare-todo

Cloudflare Workers で Web サービスを作るときのひな形。題材として Todo アプリを実装している。

デプロイ先で継続的に使われているサービスではない。後方互換は気にせず、周辺ツールやライブラリの変化に合わせて構成ごと更新していく。

## 構成

pnpm ワークスペースのモノレポ。

| ワークスペース | 内容 |
|---|---|
| `workspaces/back` | API サーバー。Hono + Cloudflare Workers、D1（Drizzle ORM）、R2。オニオンアーキテクチャ |
| `workspaces/front` | SSR アプリ。React Router v8 + Cloudflare Workers、TanStack Query、i18next、TailwindCSS |
| `workspaces/e2e` | Playwright の E2E テスト |

- 認証は BetterAuth + Google OAuth
- back の型（`AppType`）を front が Hono RPC クライアント（`hc`）で読み込み、API を型安全に呼ぶ
- lint・整形・型チェック・テストは Vite+（`vp`）にまとめている
- 環境は `local` / `dev` / `prd` の 3 つ。設定は各ワークスペースの `wrangler.jsonc`

## セットアップ

Node と pnpm のバージョンは `mise.toml` で固定している。

```bash
mise install
pnpm install
```

`workspaces/back/.dev.vars` を作り、次の値を書く（gitignore 済み）。

```
BETTER_AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

local では `/api/auth/dev-login` からシード済みのテストユーザーでログインできるので、Google OAuth を設定しなくても動かせる。

devcontainer で Claude Code を動かす場合は `scripts/claude.sh` を使う。

## 開発

```bash
pnpm b dev    # API      http://localhost:8787
pnpm f dev    # フロント http://localhost:5173
```

## テスト・チェック

```bash
pnpm test:unit   # back + front の単体テスト
pnpm test:api    # API 統合テスト（Bruno）。local の DB と R2 をリセットする
pnpm test:e2e    # E2E テスト。local の DB をリセットする。dev サーバー 2 つを起動しておく
pnpm check-all   # 整形・lint・型・knip・全テスト
```

## デプロイ

```bash
pnpm b deploy:dev && pnpm f deploy:dev
pnpm b deploy:prd && pnpm f deploy:prd
```

front は Service Binding で back を呼ぶので、back を先にデプロイする。

## ひな形として使うとき

`totakn.com` や `todo-*` の名前を自分の環境に合わせて書き換える。

1. `workspaces/*/wrangler.jsonc` の Worker 名、ルート（ドメイン）、`vars` の URL を書き換える
2. D1 データベースと R2 バケットを作り、`wrangler.jsonc` の名前と `database_id` を差し替える
3. dev / prd の Worker に `BETTER_AUTH_SECRET` / `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` をシークレットとして登録する
4. Google Cloud の OAuth クライアントに、リダイレクト URI として `<BETTER_AUTH_URL>/api/auth/callback/google` を登録する
