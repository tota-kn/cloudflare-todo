# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code)にガイダンスを提供します。

## プロジェクト構造

これは、pnpm ワークスペースモノレポを使用したフルスタックCloudflare Todoアプリケーションです：

- **back/**: Cloudflare Workersにデプロイされる Hono ベースのAPIサーバー
- **front/**: Cloudflare Pagesにデプロイされる React Router v7 SSRアプリケーション
- **shared/**: フロントエンドとバックエンド間で共有される型定義

## 開発コマンド

### ルートレベル
```bash
# 依存関係をインストール
pnpm install

# バックエンドで作業
pnpm b [command]

# フロントエンドで作業
pnpm f [command]

# 両方の型チェックを実行
pnpm typecheck
```

### バックエンド (back/)
```bash
# 開発サーバーを起動
pnpm dev              # local envでlocalhost:8787で実行

# 型生成とチェック
pnpm cf-typegen       # Cloudflare環境の型を生成
pnpm typecheck        # 型チェックと宣言ファイル生成

# リント & 修正
pnpm lint

# デプロイ
pnpm deploy:dev       # dev環境にデプロイ
pnpm deploy:prd       # productionにデプロイ

# データベース操作
pnpm db:migrate       # D1データベースマイグレーションを適用

# API テスト
pnpm test:api         # Bruno APIテストを実行
```

### フロントエンド (front/)
```bash
# 開発サーバーを起動
pnpm dev              # local envでlocalhost:5173で実行

# アプリケーションをビルド
pnpm build

# 型生成とチェック
pnpm cf-typegen       # Cloudflare環境の型を生成
pnpm typecheck        # CF types、RR types を生成し、tscを実行

# デプロイ
pnpm deploy:dev       # ビルドしてdevにデプロイ
pnpm deploy:prd       # ビルドしてproductionにデプロイ

# プロダクションビルドをプレビュー
pnpm preview
```

## アーキテクチャ

### バックエンドアーキテクチャ
- **フレームワーク**: Hono with TypeScript
- **パターン**: オニオンアーキテクチャ（関心の分離が明確）
- **構造**: 
  - `src/domain/` - エンティティ、リポジトリ、値オブジェクト
  - `src/application/` - ユースケースとDTO
  - `src/infrastructure/` - D1/R2実装、依存性注入
  - `src/presentation/` - コントローラー、ルート、バリデーター
- **バリデーション**: `@hono/zod-validator`でZodスキーマ
- **エントリーポイント**: `src/index.ts` - Worker実行環境、`src/presentation/app.ts` - アプリケーション構成
- **データベース**: `migrations/`でCloudflare D1マイグレーション
- **ストレージ**: ファイルアップロード用のCloudflare R2
- **型安全性**: ルートがフロントエンドで使用される型をエクスポート

### フロントエンドアーキテクチャ
- **フレームワーク**: SSR付きReact Router v7
- **デプロイ**: Workers統合によるCloudflare Pages
- **エントリーポイント**: 
  - `app/root.tsx` - ルートレイアウトとエラーバウンダリー
  - `workers/app.ts` - Cloudflare Workerエントリーポイント
- **ルーティング**: `app/routes/`でファイルベースルーティング
- **APIクライアント**: バックエンドルートから完全な型安全性を持つHono RPCクライアント
- **スタイリング**: TailwindCSS

### 型共有戦略
- バックエンドルートが`src/presentation/app.ts`から`AppType`をエクスポート
- `shared/client.ts`がこれを`ClientType`として再エクスポート
- フロントエンドが完全に型付けされたAPIクライアント用に`hc<ClientType>()`を使用
- これによりバックエンドからフロントエンドへのエンドツーエンドの型安全性を実現

### 環境設定
両アプリはWranglerを環境固有の設定で使用：
- **local**: `http://localhost:5173` CORS origin
- **dev**: `https://todo-front-dev.omen-bt.workers.dev` CORS origin  
- **prd**: `https://todo-front-prd.omen-bt.workers.dev` CORS origin

## 重要なファイル

- `back/src/index.ts` - メインバックエンドエントリーポイントとルート構成
- `back/src/Dependencies.ts` - 依存性注入コンテナ
- `front/app/client.ts` - 型付きAPIクライアント設定
- `front/workers/app.ts` - Cloudflare Workerリクエストハンドラー
- `shared/client.ts` - バックエンドとフロントエンド間の型ブリッジ
- `**/wrangler.jsonc` - Cloudflare Workers設定
- `back/migrations/0001_initial_schema.sql` - 初期データベーススキーマ
- `back/migrations/0002_add_todo_attachments.sql` - ファイル添付機能のスキーマ

## 開発ワークフロー

1. バックエンドの変更: `back/src/presentation/routes/`でルートを編集、型は自動的にフロントエンドに流れる
2. フロントエンドの変更: ローダー/アクションで型付きクライアントを使用、完全なIntelliSenseが利用可能
3. 両アプリはホットリロードで同時に開発可能
4. Cloudflare Workers（バックエンド）とPages（フロントエンド）に別々にデプロイ
5. `back/test/api/`のテストスイートでBrunoを使用したAPIテスト

## オニオンアーキテクチャ実装

- **ドメイン層**: エンティティと値オブジェクトによる純粋なビジネスロジック
- **アプリケーション層**: ユースケースがビジネス操作を統率
- **インフラストラクチャ層**: リポジトリの具体的実装
- **プレゼンテーション層**: HTTPコントローラーとルート定義
- **依存性注入**: `Dependencies.ts`で一元化
- **依存方向制御**: ESLintの`import/no-restricted-paths`ルールでオニオンアーキテクチャの依存方向を強制

## メモリ

### 重要な指示と注意点
- 常に日本語で応答する
- 求められたことを行う。それ以上でも以下でもない。
- 目標を達成するために絶対に必要でない限り、ファイルを作成しない。
- 新しいファイルを作成するより、既存のファイルを編集することを常に優先する。
- ユーザーから明示的に要求されない限り、ドキュメントファイル（*.md）やREADMEファイルを積極的に作成しない。

# important-instruction-reminders
求められたことを行う。それ以上でも以下でもない。
目標を達成するために絶対に必要でない限り、ファイルを作成しない。
新しいファイルを作成するより、既存のファイルを編集することを常に優先する。
ユーザーから明示的に要求されない限り、ドキュメントファイル（*.md）やREADMEファイルを積極的に作成しない。