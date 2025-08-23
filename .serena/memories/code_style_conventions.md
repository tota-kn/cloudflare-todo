# コードスタイル・規約

## ESLint設定

### バックエンド
- **ベース設定**: @eslint/js, typescript-eslint, @stylistic/eslint-plugin
- **オニオンアーキテクチャ強制**: eslint-plugin-boundaries + import/no-restricted-paths
- **依存方向制御**:
  - Domain層: 他の層をimport不可
  - Application層: Presentation/Infrastructure層をimport不可
  - Infrastructure層: Presentation層をimport不可
- **インポート制御**: eslint-plugin-import with TypeScript resolver

### フロントエンド
- **ベース設定**: @eslint/js, typescript-eslint, @stylistic/eslint-plugin
- **React設定**: eslint-plugin-react + eslint-plugin-react-hooks
- **特別ルール**: 
  - `@stylistic/indent`: バグのため無効化
  - `@typescript-eslint/no-unused-vars`: アンダースコア接頭辞の未使用パラメータ許可

## TypeScript設定
- **strict mode**: 有効
- **型生成**: Wranglerによる自動生成（CloudflareEnv）
- **パスエイリアス**: `@` → `src/`（バックエンド）

## コーディング規約
- **関数名**: camelCase
- **クラス名**: PascalCase
- **ファイル名**: PascalCase（コンポーネント）、camelCase（その他）
- **型定義**: 
  - インターフェース: `I`接頭辞（例: `ITodoRepository`）
  - DTO: `Dto`接尾辞（例: `TodoDto`）
  - 値オブジェクト: 対象名（例: `TodoId`, `TodoStatus`）

## ディレクトリ・ファイル構造規約
- **コンポーネント**: 1ファイル1コンポーネント
- **ユースケース**: 1ファイル1ユースケース（`*UseCase.ts`）
- **リポジトリ**: インターフェース（`I*.ts`）と実装（`*Repository.ts`）を分離
- **ルート**: RESTfulなディレクトリ構造（`/api/v1/todos/_todoId/get.ts`）

## テスト規約
- **単体テスト**: `*.test.ts`
- **API統合テスト**: Brunoコレクション
- **E2Eテスト**: Playwright（`*.spec.ts`）
- **テストデータ**: `migrations/0002_reset_and_seed_test_data.sql`でリセット

## その他の規約
- **環境設定**: `wrangler.jsonc`で環境別設定管理
- **型安全性**: バックエンド→フロントエンドのエンドツーエンド型安全性を必須
- **依存性注入**: `Dependencies.ts`で一元管理