# 開発環境情報

## システム環境
- **OS**: Linux (WSL2)
- **パッケージマネージャー**: pnpm
- **Node.js**: 推奨LTS版

## 利用可能なLinuxコマンド
- **ファイル操作**: `ls`, `find`, `grep`, `cat`, `head`, `tail`
- **Git操作**: `git status`, `git diff`, `git log`, `git add`, `git commit`
- **プロセス管理**: `ps`, `kill`
- **ネットワーク**: `curl`, `wget`

## 環境別設定
### Local環境
- **バックエンド**: `http://localhost:8787`
- **フロントエンド**: `http://localhost:5173`
- **CORS Origin**: `http://localhost:5173`
- **データベース**: ローカルD1データベース

### Dev環境
- **バックエンド**: `https://todo-api-dev.omen-bt.workers.dev`
- **フロントエンド**: `https://todo-front-dev.omen-bt.workers.dev`
- **CORS Origin**: `https://todo-front-dev.omen-bt.workers.dev`

### Production環境
- **バックエンド**: `https://todo-api-prd.omen-bt.workers.dev`
- **フロントエンド**: `https://todo-front-prd.omen-bt.workers.dev`
- **CORS Origin**: `https://todo-front-prd.omen-bt.workers.dev`

## Cloudflare設定
- **Workers設定**: `wrangler.jsonc`
- **環境変数**: Wranglerで管理
- **データベース**: D1（マイグレーションファイルで管理）
- **ストレージ**: R2バケット

## API仕様
- **Bruno**: `back/test/api/`でAPIテスト管理
- **OpenAPI**: Hono OpenAPIで自動生成
- **Swagger UI**: 開発時に利用可能