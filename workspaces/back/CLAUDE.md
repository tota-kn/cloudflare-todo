# CLAUDE.md

バックエンドワークスペース固有のガイダンス。

## アーキテクチャ

Hono + TypeScript のオニオンアーキテクチャ。エントリーポイントは `src/index.ts` → `src/presentation/app.ts`。

- `src/domain/` - エンティティ（`Todo`）、値オブジェクト（`TodoId`, `TodoStatus`）
- `src/application/` - ユースケース、DTO、リポジトリインターフェース（`ITodoRepository`）
- `src/infrastructure/` - D1/R2 実装（`D1TodoRepository`）、Drizzle ORM スキーマ
- `src/presentation/` - ルートハンドラー、ミドルウェア（`authMiddleware`）
- `src/utils/` - `auth.ts`（better-auth 設定: Google OAuth、Drizzle の SQLite アダプタ、bearer プラグイン）など
- `src/types/env.d.ts` - Cloudflare 環境型（`pnpm typegen` で自動生成）
- `src/Dependencies.ts` - DI コンテナ（`CloudflareEnv` から全ユースケース・リポジトリを初期化）
- `migrations/` - D1 スキーマ（`0001`）とテストデータシード（`0002`）

### 依存ルール

ルートの `vite.config.ts` の `lint.overrides`（oxlint の `no-restricted-imports`）で強制している：

- **Domain 層** → 他の層を import できない
- **Application 層** → Domain 層のみ
- **Infrastructure 層** → Domain 層と Application 層のリポジトリインターフェースのみ
- **Presentation 層** → 同じ Presentation 層内のみ。他層へは `Dependencies` 経由でアクセスする
- **`Dependencies.ts`** → 境界ルールから除外（全層を結合する DI コンテナ）

### ルートファイル規約

`src/presentation/api/` 以下はファイルベースルーティング：

- パスがディレクトリ構造に対応（例: `v1/todos/_todoId/put.ts` → `PUT /v1/todos/:todoId`）
- 動的パラメータは `_` プレフィックスのディレクトリ
- HTTP メソッドがファイル名（`get.ts`, `post.ts`, `put.ts`, `delete.ts`）
- 各ファイルは `Dependencies` を受け取り Hono アプリを返す関数をエクスポートし、`app.ts` で `.route("", handler(dependencies))` として登録する
- バリデーションは `@hono/zod-validator` の Zod スキーマで行う
- 新しいルートは「ハンドラー作成 → `app.ts` に登録 → Bruno テスト追加」の順で足す

## 開発コマンド

```bash
pnpm dev              # マイグレーション適用後 localhost:8787 で起動
pnpm typegen:dts      # front 向けの dist/types だけを再生成（型チェックなしで高速）
pnpm test:unit        # Vitest（カバレッジ付き）
pnpm exec vp test run test/unit/domain/entities/Todo.test.ts  # 単一ファイル
pnpm test:api         # bucket:reset + db:reset 後に Bruno API テスト
pnpm db:reset         # テストデータをシード
```

## テスト構成

- **単体テスト** (`test/unit/`): `src/` の構造をミラー。`test/unit/mocks/` にモックリポジトリとテストファクトリ
- **API 統合テスト** (`test/api/`): Bruno コレクション。`environments/` に環境設定。エンドポイントごとにディレクトリを分ける
