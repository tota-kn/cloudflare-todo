# 推奨コマンド

## 依存関係インストール
```bash
pnpm install
```

## 開発サーバー起動
```bash
# バックエンド開発サーバー（localhost:8787）
pnpm back dev

# フロントエンド開発サーバー（localhost:5173）
pnpm front dev
```

## 型チェック・生成
```bash
# 両方の型チェック
pnpm typecheck

# バックエンドのみ
pnpm back typecheck
pnpm back cf-typegen

# フロントエンドのみ
pnpm front typecheck
pnpm front cf-typegen
```

## リント・フォーマット
```bash
# バックエンドリント（自動修正付き）
pnpm back lint
```

## テスト
```bash
# Bruno APIテスト実行
pnpm back test:api
```

## データベース
```bash
# D1マイグレーション適用
pnpm back db:migrate
```

## ビルド・デプロイ
```bash
# バックエンドデプロイ
pnpm back deploy:dev  # dev環境
pnpm back deploy:prd  # production環境

# フロントエンドデプロイ
pnpm front deploy:dev # dev環境
pnpm front deploy:prd # production環境

# フロントエンドビルド・プレビュー
pnpm front build
pnpm front preview
```

## ワークスペース操作
```bash
# 特定パッケージでコマンド実行
pnpm back [command]  # back/でコマンド実行
pnpm front [command] # front/でコマンド実行
```