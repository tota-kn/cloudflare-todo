# CLAUDE.md

フロントエンドワークスペース固有のガイダンス。

## 構成

React Router v8（SSR）を Cloudflare Workers で動かす。サーバー状態は TanStack Query、スタイルは TailwindCSS v4。

- `workers/app.ts` - Worker エントリーポイント。リクエストを React Router に渡すだけ
- `app/entry.server.tsx` - SSR レンダリング（`renderToReadableStream`）
- `app/root.tsx` - ルートレイアウト。QueryClientProvider → ThemeProvider → Outlet
- `app/routes.ts` - 全ルートを明示的に定義。`/` は `/en/todos` へリダイレクトし、それ以外は `/:lang/...`（`login`, `todos`, `todos/new`, `todos/:id`）。`todos` 以下は認証必須

### API クライアント（`app/client.ts`）

- **`createServerFetcher(env, headers?)`** - SSR loader/action 用。local では直接 fetch、dev/prd では Service Binding（`env.BACKEND_API`）経由
- **`createBrowserClient()`** - ブラウザ用。`credentials: 'include'` で Cookie を送る
- **`requireAuth(env, lang, cookie?)`** - 未認証時は `/:lang/login` へリダイレクト

### loader/action

Cloudflare 環境変数は `cloudflare:workers` の `env` を直接 import する（React Router v8 では `AppLoadContext` が使えない）：

```typescript
import { env } from "cloudflare:workers"

export async function loader({ params, request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, params.lang, cookie)
  const client = createServerFetcher(env, cookie ? { Cookie: cookie } : undefined)
  // ...
}
```

### TanStack Query（`app/hooks/useTodos.ts`）

- `useTodos(initialData?)` - loader データを placeholderData として渡す
- `useCreateTodo()`, `useUpdateTodo()`, `useDeleteTodo()`, `useToggleTodo()` - すべて Optimistic Updates
- クエリキーは `["todos"]` で統一

### i18n（`app/i18n/config.ts`）

- 翻訳ファイルは `app/locales/{en,ja}/common.json`
- 言語は URL の先頭セグメント（`/:lang/...`）で決まる。各ルートは `useI18nLanguage(loaderData.language)` で合わせる
- クライアントは `initI18nClient(language)` でシングルトン初期化し、`useTranslation()` で使う

### その他

- テーマ: light/dark を `data-theme` 属性 + localStorage で管理（`app/contexts/ThemeContext.tsx`）
- 環境判定（`app/utils/env.ts`）: `isLocal` / `isDev` / `isPrd` はサーバーでは `env.STAGE`、ブラウザではホスト名で判定。`getApiUrl` / `getFrontUrl` も同じ
- BetterAuth クライアント: `app/utils/auth-client.ts`

## テスト

- `test/**/*.test.{ts,tsx}`、jsdom 環境、`TZ=UTC` でタイムゾーン固定
- パスエイリアス `~` → `/app`（`vitest.config.ts`）
