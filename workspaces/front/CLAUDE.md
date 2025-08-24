# フロントエンド (front/) - CLAUDE.md

このファイルはフロントエンドワークスペース固有のClaude Codeガイダンスを提供します。

## アーキテクチャ

### フロントエンドアーキテクチャ

- **フレームワーク**: SSR付きReact Router v7
- **デプロイ**: Workers統合によるCloudflare Pages
- **エントリーポイント**:
  - `app/root.tsx` - ルートレイアウトとエラーバウンダリー
  - `workers/app.ts` - Cloudflare Workerエントリーポイント
- **ルーティング**: `app/routes/`でファイルベースルーティング
- **APIクライアント**: バックエンドルートから完全な型安全性を持つHono RPCクライアント
- **スタイリング**: TailwindCSS v4
- **状態管理**: TanStack Query for server state

### ルーティング構造

- `app/routes/` - ファイルベースルーティング
- React Router v7のSSR機能を活用
- 各ルートでローダー/アクションパターンを使用
- 型安全なAPIクライアントで完全なIntelliSense

### スタイリング

- TailwindCSS v4を使用
- ユーティリティファーストアプローチ
- レスポンシブデザイン対応

## 開発コマンド

### 開発サーバー

```bash
pnpm dev              # local envでlocalhost:5173で実行
```

### ビルド

```bash
pnpm build            # アプリケーションをビルド
pnpm preview          # プロダクションビルドをプレビュー
```

### 型生成とチェック

```bash
pnpm typegen          # Cloudflare環境の型を生成
pnpm typecheck        # CF types、RR types を生成し、tscを実行
```

### リント

```bash
pnpm lint             # ESLintでコード品質チェック
```

### デプロイ

```bash
pnpm deploy:dev       # ビルドしてdevにデプロイ
pnpm deploy:prd       # ビルドしてproductionにデプロイ
```

## 重要なファイル

- `app/root.tsx` - ルートレイアウトとエラーバウンダリー
- `workers/app.ts` - Cloudflare Workerリクエストハンドラー
- `app/client.ts` - 型付きAPIクライアント設定
- `wrangler.jsonc` - Cloudflare Workers設定
- `react-router.config.ts` - React Router設定
- `vite.config.ts` - Vite設定
- `worker-configuration.d.ts` - Worker型定義

## 開発ワークフロー

1. フロントエンドの変更: ローダー/アクションで型付きクライアントを使用
2. 完全なIntelliSenseが利用可能（バックエンドからの型安全性）
3. ホットリロードで開発効率向上
4. Cloudflare Pages（フロントエンド）にデプロイ

### 型安全なAPIクライアント

- バックエンドの`AppType`を`shared/client.ts`経由で受け取る
- `hc<ClientType>()`で完全に型付けされたAPIクライアント
- エンドツーエンドの型安全性を実現

### フロントエンド固有の開発指針

- React Router v7の規約に従う
- ローダー/アクションパターンでデータフェッチング
- TanStack Queryでサーバー状態管理
- TailwindCSSでユーティリティファーストスタイリング
- 型安全なAPIクライアントを活用してランタイムエラーを防止

### パフォーマンス考慮事項

- SSRによる初期表示速度向上
- Cloudflare Pagesの高速配信
- バンドルサイズ最適化
- レスポンシブ画像対応
