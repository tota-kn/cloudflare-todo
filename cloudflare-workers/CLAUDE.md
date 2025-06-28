# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## よく使用されるコマンド

### 開発
- `pnpm dev`: React Router開発サーバーを起動
- `pnpm start`: Wrangler開発サーバーを起動（Cloudflare Workers環境をローカルで実行）
- `pnpm preview`: プロダクション用ビルドをローカルで実行

### ビルド・デプロイ
- `pnpm build`: React Router用にプロダクションビルドを作成
- `pnpm deploy`: ビルド後、Cloudflare Workersにデプロイ
- `pnpm typecheck`: TypeScriptの型チェックとReact Routerのタイプ生成を実行

### テスト
- `pnpm test:e2e:vite`: Vite開発サーバーでE2Eテストを実行
- `pnpm test:e2e:workers`: プロダクションビルドでE2Eテストを実行

## アーキテクチャ

このプロジェクトは、Cloudflare Workers上でReact Routerを実行するためにHonoを使用した現代的なフルスタックアプリケーションです。

### 主要コンポーネント

#### Honoサーバー (`server/index.ts`)
- Cloudflare Workers環境で動作するAPIルートを提供
- 環境変数（`MY_VAR`）とコンテキスト変数の管理
- `/api`エンドポイントでJSONレスポンスを提供
- `X-Powered-By`ヘッダーを自動的に設定

#### Worker エントリーポイント (`worker.ts`)
- `hono-react-router-adapter/cloudflare-workers`を使用してHonoとReact Routerを統合
- ビルドされたサーバーコード、Honoアプリ、ロードコンテキストを組み合わせ

#### ロードコンテキスト (`load-context.ts`)
- Cloudflare Workers API（env、cf、ctx、caches）へのアクセスを提供
- Honoコンテキストを通じて変数とバインディングを公開
- React RouterのAppLoadContextに型安全性を追加

#### React Router設定
- SSRが有効（`react-router.config.ts`）
- ファイルベースルーティング（`app/routes/`）
- `~/*`パスが`./app/*`にマップされる

### 開発環境

#### Vite設定 (`vite.config.ts`)
- Cloudflare Workers開発プロキシ
- Hono開発サーバーアダプター
- TypeScriptパス解決
- サーバーエントリーポイント: `server/index.ts`

#### Wrangler設定 (`wrangler.toml`)
- エントリーポイント: `worker.ts`
- 静的アセット: `./build/client`
- 環境変数: `MY_VAR`

### 型安全性
- Cloudflare Workers型（`@cloudflare/workers-types/2023-07-01`）
- HonoとReact Routerの完全な型統合
- 環境変数とコンテキスト変数の型定義

### E2Eテスト
- Playwrightを使用したテスト
- Viteと実際のWorkers環境の両方でテスト可能
- `e2e.test.ts`にテストケースを記述