# 開発環境構成

## 必要な環境
- **Node.js**: 推奨版（package.jsonのenginesで指定）
- **pnpm**: パッケージマネージャ（pnpm-lock.yamlを使用）
- **Playwright**: E2Eテスト用（`pnpx playwright install`で初期化）

## ローカル開発環境

### Cloudflare Workers開発
- **Wrangler**: Cloudflare公式CLI
- **ローカル実行**: `wrangler dev -e local`
- **環境固有設定**: `wrangler.jsonc`で管理
  - `local`: http://localhost:5173 CORS
  - `dev`: https://todo-front-dev.omen-bt.workers.dev CORS  
  - `prd`: https://todo-front-prd.omen-bt.workers.dev CORS

### データベース（D1）
- **ローカル実行**: `--local`フラグでローカルSQLite使用
- **マイグレーション**: `migrations/`ディレクトリで管理
- **テストデータ**: `0002_reset_and_seed_test_data.sql`で初期化

### ストレージ（R2）
- **バケット初期化**: `back/buckets/init.sh`スクリプト
- **ローカル開発**: `wrangler dev`でローカルエミュレーション

## IDEサポート

### VS Code設定（.vscode/）
- **Tailwind CSS IntelliSense**: 有効
- **TypeScript**: 厳密モード
- **ESLint**: 自動修正有効
- **React Router**: ルート補完対応

### 型生成とウォッチ
```bash
pnpm b typecheck:watch       # バックエンド型監視
pnpm f typecheck:watch       # フロントエンド型監視
```

## テスト環境

### 単体テスト（Vitest）
- **設定**: `back/vitest.config.ts`
- **カバレッジ**: v8プロバイダー使用
- **対象**: Domain/Application層のみ

### API統合テスト（Bruno）
- **設定**: `back/test/api/`
- **環境**: local環境で実行
- **データ**: 実行前にDB/バケットをリセット

### E2Eテスト（Playwright）
- **設定**: `e2e/playwright.config.ts`
- **ブラウザ**: Chromium, Firefox, Webkit対応
- **UI モード**: `pnpm e2e test:ui`で視覚的テスト

## 環境変数・設定
- **Cloudflare環境**: `wrangler.jsonc`で管理
- **型生成**: 各環境の設定から自動型生成
- **CORS設定**: 環境別にオリジン制御

## ホットリロード対応
- **バックエンド**: Wranglerによるファイル監視・自動再起動
- **フロントエンド**: Vite によるホットモジュールリプレースメント
- **並行開発**: 両方のサーバーを同時起動して開発可能