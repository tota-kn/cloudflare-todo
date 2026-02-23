# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルはバックエンドワークスペース固有のClaude Codeガイダンスを提供します。

## アーキテクチャ

### バックエンドアーキテクチャ

- **フレームワーク**: Hono with TypeScript
- **パターン**: オニオンアーキテクチャ（関心の分離が明確）
- **構造**:
  - `src/domain/` - エンティティ（`Todo`）、値オブジェクト（`TodoId`, `TodoStatus`）
  - `src/application/` - ユースケース、DTO、リポジトリインターフェース（`ITodoRepository`）
  - `src/infrastructure/` - D1/R2実装（`D1TodoRepository`）、Drizzle ORMスキーマ
  - `src/presentation/` - ルートハンドラー、ミドルウェア（`authMiddleware`）
  - `src/utils/` - 共通ユーティリティ（`auth.ts`でbetter-auth設定、`dateTime.ts`）
  - `src/types/` - Cloudflare環境型（`env.d.ts`は自動生成）
- **バリデーション**: `@hono/zod-validator`でZodスキーマ
- **エントリーポイント**: `src/index.ts` → `src/presentation/app.ts`
- **認証**: better-auth + Google OAuth、Drizzle ORM（SQLiteアダプタ）、bearerプラグイン
- **データベース**: Cloudflare D1（SQLite）、マイグレーションは`migrations/`
- **ストレージ**: ファイルアップロード用のCloudflare R2
- **型安全性**: `app.ts`から`AppType`をエクスポートし、フロントエンドで`hc<AppType>()`として利用
- **テスト**: Vitestで単体テスト、Bruno CLIでAPI統合テスト

### オニオンアーキテクチャの依存ルール

ESLintの`import/no-restricted-paths`と`eslint-plugin-boundaries`で依存方向を強制：
- **Domain層** → 他の層をimportできない（純粋なビジネスロジック）
- **Application層** → Domain層のみ依存可能
- **Infrastructure層** → Domain層とApplication層（リポジトリインターフェースのみ）に依存可能
- **Presentation層** → 同じPresentation層内のファイルのみ依存可能
- **`Dependencies.ts`** → 境界ルールから除外。全層を結合するDIコンテナとして機能し、Presentation層からのみ利用される

### ルートファイル規約

`src/presentation/api/`以下でファイルベースルーティングパターンを採用：
- パスセグメントがディレクトリ構造に対応（例: `v1/todos/_todoId/put.ts` → `PUT /v1/todos/:todoId`）
- 動的パラメータは`_`プレフィックスのディレクトリ（`_todoId`）
- HTTPメソッドがファイル名（`get.ts`, `post.ts`, `put.ts`, `delete.ts`）
- 各ファイルは`Dependencies`を受け取りHonoアプリケーションを返す関数をエクスポート
- 全ルートは`app.ts`で`.route("", handler(dependencies))`として登録

## 開発コマンド

```bash
# 開発サーバー（マイグレーション自動適用）
pnpm dev              # local envでlocalhost:8787で実行

# 型生成・チェック
pnpm typegen          # Cloudflare環境の型を生成（src/types/env.d.ts）
pnpm typecheck        # typegen + tsc --declaration

# リント（ESLint --fix + Prettier --write を両方実行）
pnpm lint

# テスト
pnpm test:unit        # Vitest実行（カバレッジ付き）
pnpm test:unit:watch  # ウォッチモード
pnpm test:api         # bucket:reset + db:reset後にBruno APIテスト実行

# 単一テストファイルの実行
npx vitest run test/unit/domain/entities/Todo.test.ts

# データベース操作
pnpm db:migrate       # D1マイグレーション適用
pnpm db:reset         # テストデータでシード
pnpm bucket:reset     # R2バケットリセット

# デプロイ
pnpm deploy:dev       # dev環境
pnpm deploy:prd       # production環境
```

## 重要なファイル

- `src/index.ts` - Workerエントリーポイント
- `src/presentation/app.ts` - Honoアプリ構成、`AppType`型エクスポート（フロントエンドとの型共有の起点）
- `src/Dependencies.ts` - DIコンテナ（`CloudflareEnv`から全ユースケース・リポジトリを初期化）
- `src/utils/auth.ts` - better-auth設定（Google OAuth、セッション、Cookie設定）
- `src/presentation/middleware/authMiddleware.ts` - セッション検証ミドルウェア
- `src/application/repositories/ITodoRepository.ts` - リポジトリインターフェース（Domain層のエンティティを扱う）
- `eslint.config.mjs` - オニオンアーキテクチャ依存方向の強制ルール
- `wrangler.jsonc` - 環境別Cloudflare Workers設定（local/dev/prd）
- `migrations/0001_create_tables.sql` - 初期スキーマ
- `migrations/0002_seed_test_data.sql` - テストデータシード

## テスト構成

- **単体テスト** (`test/unit/`): `src/`のディレクトリ構造をミラー。`test/unit/mocks/`にモックリポジトリとテストファクトリ
- **API統合テスト** (`test/api/`): Brunoコレクション。`environments/`に環境設定（local/dev/prd）。エンドポイントごとにディレクトリ分割

## 開発指針

- オニオンアーキテクチャの依存方向を厳守（`pnpm lint`で検証可能）
- Presentation層からは`Dependencies`経由でのみ他層にアクセス
- バリデーションはPresentation層のZodスキーマで実施
- 新しいルートを追加する場合：ルートハンドラー作成 → `app.ts`に登録 → Brunoテスト追加
