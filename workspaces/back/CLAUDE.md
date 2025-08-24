# バックエンド (back/) - CLAUDE.md

このファイルはバックエンドワークスペース固有のClaude Codeガイダンスを提供します。

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
- **テスト**: Vitestで単体テスト、Brunoで統合テスト

### オニオンアーキテクチャ実装

- **ドメイン層**: エンティティと値オブジェクトによる純粋なビジネスロジック
- **アプリケーション層**: ユースケースがビジネス操作を統率
- **インフラストラクチャ層**: リポジトリの具体的実装
- **プレゼンテーション層**: HTTPコントローラーとルート定義
- **依存性注入**: `Dependencies.ts`で一元化
- **依存方向制御**: ESLintの`import/no-restricted-paths`ルールでオニオンアーキテクチャの依存方向を強制

## 開発コマンド

### 開発サーバー

```bash
pnpm dev              # local envでlocalhost:8787で実行
```

### 型生成とチェック

```bash
pnpm typegen          # Cloudflare環境の型を生成
pnpm typecheck        # 型チェックと宣言ファイル生成
```

### リント & 修正

```bash
pnpm lint             # ESLintでコード品質チェック
```

### デプロイ

```bash
pnpm deploy:dev       # dev環境にデプロイ
pnpm deploy:prd       # productionにデプロイ
```

### テスト

```bash
pnpm test:unit        # 単体テスト実行（カバレッジ付き）
pnpm test:unit:watch  # 単体テストウォッチモード
pnpm test:api         # Bruno APIテストを実行
```

### データベース操作

```bash
pnpm db:migrate       # D1データベースマイグレーションを適用
pnpm db:reset         # テストデータでデータベースリセット
pnpm bucket:reset     # R2バケットリセット
```

## 重要なファイル

- `src/index.ts` - メインバックエンドエントリーポイントとWorker設定
- `src/presentation/app.ts` - Honoアプリケーション構成、AppType型エクスポート
- `src/Dependencies.ts` - 依存性注入コンテナ
- `wrangler.jsonc` - Cloudflare Workers設定
- `migrations/0001_todos_table.sql` - 初期データベーススキーマ
- `migrations/0002_reset_and_seed_test_data.sql` - テストデータ用のリセット/シードスクリプト
- `eslint.config.mjs` - オニオンアーキテクチャ強制のESLint設定

## 開発ワークフロー

1. バックエンドの変更: `src/presentation/api/v1/`でルートを編集
2. 型は自動的にフロントエンドに流れる（`AppType`エクスポート経由）
3. `test/api/`のテストスイートでBrunoを使用したAPIテスト
4. 変更前に`pnpm typecheck`で型チェック、`pnpm lint`でコード品質確認

### テスト戦略

- **単体テスト**: Vitestを使用、各層を独立してテスト
- **統合テスト**: Bruno APIテストでエンドツーエンドのAPI動作確認
- **カバレッジ**: 単体テスト実行時に自動的にカバレッジレポート生成

### バックエンド固有の開発指針

- オニオンアーキテクチャの依存方向を厳守する
- 各層の責任を明確に分離する
- ドメイン層にインフラストラクチャの詳細を漏らさない
- ユースケースで複雑なビジネスロジックを統率する
- バリデーションはプレゼンテーション層で行い、型安全性を保つ
