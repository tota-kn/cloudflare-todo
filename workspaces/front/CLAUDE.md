# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルはフロントエンドワークスペース固有のClaude Codeガイダンスを提供します。

## 開発コマンド

```bash
pnpm dev                # local envでlocalhost:5173で実行
pnpm build              # アプリケーションをビルド
pnpm typegen            # Cloudflare環境の型 + React Router の型を生成（型チェックはルートの pnpm typecheck）

# テスト
pnpm test:unit          # vp test run（単発実行）

# デプロイ
pnpm deploy:dev         # CLOUDFLARE_ENV=dev でビルド→デプロイ
pnpm deploy:prd         # CLOUDFLARE_ENV=prd でビルド→デプロイ
```

### テスト構成

- テストファイルは `test/` ディレクトリに配置（`test/**/*.test.{ts,tsx}`）
- vitest + jsdom環境、`TZ=UTC` でタイムゾーン固定
- パスエイリアス `~` → `/app`（vitest.config.tsで設定）

## アーキテクチャ

### 技術スタック

- **フレームワーク**: React Router v8（SSR）+ Cloudflare Pages
- **APIクライアント**: Hono RPCクライアント（`hc<ClientType>()`）
- **状態管理**: TanStack Query（サーバー状態）
- **認証**: BetterAuth（`better-auth/react`）
- **i18n**: i18next + react-i18next（`en`/`ja`対応）
- **スタイリング**: TailwindCSS v4
- **テーマ**: light/dark（`data-theme`属性 + localStorage）

### エントリーポイント

- `workers/app.ts` - Cloudflare Workerエントリーポイント。リクエストを React Router に渡すだけ
- `app/entry.server.tsx` - SSRレンダリング（`renderToReadableStream`）
- `app/root.tsx` - ルートレイアウト。QueryClientProvider → ThemeProvider → Outlet

### ルーティング（`app/routes.ts`で明示的に定義）

```
/                         → /en/todosへリダイレクト
/:lang                    → 言語ルートインデックス
/:lang/login              → ログインページ
/:lang/todos              → Todo一覧（認証必須）
/:lang/todos/new          → Todo新規作成（認証必須）
/:lang/todos/:id          → Todo詳細・編集（認証必須）
```

### APIクライアントの二重構成（`app/client.ts`）

- **`createServerFetcher(env, headers?)`** - SSR loader/action用。local環境では直接fetch、dev/prd環境ではService Binding（`env.BACKEND_API`）経由
- **`createBrowserClient()`** - ブラウザ用。`credentials: 'include'`でCookie送信
- **`requireAuth(env, lang, cookie?)`** - 認証チェックヘルパー。未認証時は`/:lang/login`へリダイレクト

### loader/actionパターン

Cloudflare環境変数は`cloudflare:workers`の`env`を直接importしてアクセスする（React Router v8 では`AppLoadContext`が使えない）：

```typescript
import { env } from "cloudflare:workers"

export async function loader({ params, request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, params.lang, cookie)
  const client = createServerFetcher(
    env,
    cookie ? { Cookie: cookie } : undefined
  )
  // ...
}
```

### TanStack Queryフック（`app/hooks/useTodos.ts`）

- `useTodos(initialData?)` - loaderデータをplaceholderDataとして渡すパターン
- `useCreateTodo()`, `useUpdateTodo()`, `useDeleteTodo()`, `useToggleTodo()` - 全てOptimistic Updatesを実装
- クエリキーは `["todos"]` で統一

### i18n構成

- 翻訳ファイル: `app/locales/{en,ja}/common.json`
- クライアントサイド: `initI18nClient(language)` でシングルトン初期化、`useTranslation()` で使用
- 各ルートは `useI18nLanguage(loaderData.language)` でページの言語に合わせる
- 言語はURLパスの先頭セグメント（`/:lang/...`）で決定

### 環境判定（`app/utils/env.ts`）

- `isLocal(env?)` / `isDev(env?)` / `isPrd(env?)` - サーバーサイドは`env.STAGE`、ブラウザサイドはホスト名で判定
- `getApiUrl(env?)` / `getFrontUrl(env?)` - 環境に応じたURLを返す

### 型共有（`app/types/shared.ts`）

- バックエンドの`AppType`と`TodoDto`を`../../../back/dist/types/`から直接インポート
- バックエンドの型変更時は`pnpm b typegen`で型を再生成する必要がある

## 重要なファイル

- `app/client.ts` - APIクライアント設定（サーバー/ブラウザ両対応）
- `app/routes.ts` - 全ルート定義
- `app/hooks/useTodos.ts` - Todo CRUD操作のカスタムフック群
- `app/contexts/ThemeContext.tsx` - テーマ管理Context
- `app/i18n/config.ts` - i18n設定と言語定義
- `app/utils/env.ts` - 環境判定ユーティリティ
- `app/utils/auth-client.ts` - BetterAuth クライアント
- `wrangler.jsonc` - Cloudflare Workers設定
- `worker-configuration.d.ts` - Worker型定義（自動生成）
