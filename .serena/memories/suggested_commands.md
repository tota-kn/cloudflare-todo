# 推奨コマンド集

## 日常的な開発コマンド

### 開発サーバー起動
```bash
# バックエンド開発サーバー（推奨：別ターミナル）
pnpm b dev              # localhost:8787 で起動

# フロントエンド開発サーバー（推奨：別ターミナル）
pnpm f dev              # localhost:5173 で起動

# 両方を同時に起動（tmux/screen使用時）
pnpm b dev & pnpm f dev
```

### 型チェック・リント
```bash
# 全体の型チェック（最重要）
pnpm typecheck          # back + front の型チェック

# 個別の型チェック
pnpm b typecheck        # バックエンドのみ
pnpm f typecheck        # フロントエンドのみ

# リントチェック
pnpm -r lint            # 全ワークスペースでリント実行
pnpm b lint             # バックエンドのみ
pnpm f lint             # フロントエンドのみ
```

## テスト実行コマンド

### 単体テスト
```bash
# 全単体テスト実行
pnpm test:unit          # back + front の単体テスト

# 個別実行
pnpm b test:unit        # バックエンド単体テスト
pnpm f test:unit        # フロントエンド単体テスト

# ウォッチモード（開発中推奨）
pnpm b test:unit:watch  # バックエンドテストをウォッチ
pnpm f test:unit:watch  # フロントエンドテストをウォッチ
```

### 統合・E2Eテスト
```bash
# API統合テスト（Bruno）
pnpm test:api           # pnpm b test:api と同じ

# E2Eテスト（DB/バケットリセット付き）
pnpm test:e2e           # pnpm b db:reset && pnpm e2e test

# E2Eテストのみ（リセットなし）
pnpm e2e test           # Playwrightテスト実行
pnpm e2e test:ui        # Playwright UI モード
```

## データベース・ストレージ操作

### データベース管理
```bash
# マイグレーション適用
pnpm b db:migrate       # D1マイグレーション実行

# データベースリセット（テストデータ投入）
pnpm b db:reset         # migration + test data seeding

# マイグレーション作成（将来）
pnpm b db:create-migration "add_new_table"
```

### ストレージ管理
```bash
# R2バケットリセット
pnpm b bucket:reset     # ローカルバケットをリセット
```

## 品質チェック・デプロイ

### 全体品質チェック（重要）
```bash
# 全品質チェック実行（CI相当）
pnpm check-all          # lint + typecheck + unit + api + e2e

# 段階的品質チェック
pnpm -r lint && pnpm typecheck        # 静的解析
pnpm test:unit && pnpm test:api       # テスト実行
pnpm test:e2e                         # E2Eテスト
```

### デプロイ
```bash
# 開発環境デプロイ
pnpm b deploy:dev       # バックエンドdev環境
pnpm f deploy:dev       # フロントエンドdev環境

# 本番環境デプロイ
pnpm b deploy:prd       # バックエンド本番環境
pnpm f deploy:prd       # フロントエンド本番環境

# ビルドのみ
pnpm f build            # フロントエンドビルド
pnpm f preview          # ビルド成果物プレビュー
```

## Cloudflare固有コマンド

### 型生成
```bash
# Cloudflare環境の型生成
pnpm b typegen          # Workers型生成
pnpm f typegen          # Pages型生成
```

### ローカル環境管理
```bash
# Wrangler情報確認
pnpm b wrangler --help  # Wranglerコマンド一覧
pnpm f wrangler --help  # Pagesコマンド一覧

# 環境変数確認
pnpm b wrangler secret list     # Workers環境変数
```

## 開発ワークフロー推奨コマンド

### 作業開始時
```bash
# 1. 依存関係更新確認
pnpm install

# 2. 開発サーバー起動
pnpm b dev &            # バックエンド起動（バックグラウンド）
pnpm f dev              # フロントエンド起動（メイン）

# 3. 型チェック確認（別ターミナル）
pnpm typecheck
```

### 機能開発中
```bash
# 継続的な型チェック
pnpm typecheck          # 変更後に実行

# 関連テスト実行
pnpm b test:unit:watch  # バックエンドテストウォッチ
pnpm f test:unit:watch  # フロントエンドテストウォッチ
```

### コミット前チェック
```bash
# 必須チェックリスト
pnpm typecheck          # 1. 型エラーがないか
pnpm -r lint            # 2. リントエラーがないか
pnpm test:unit          # 3. 単体テストが通るか
pnpm test:api           # 4. APIテストが通るか

# 大きな変更時
pnpm test:e2e           # 5. E2Eテストが通るか
```

### 完全チェック（リリース前）
```bash
# 全品質チェック実行
pnpm check-all          # 全チェック実行

# 個別確認
pnpm -r lint            # リント確認
pnpm typecheck          # 型安全性確認
pnpm test:unit          # 単体テスト確認
pnpm test:api           # API統合テスト確認
pnpm test:e2e           # E2Eテスト確認
```

## トラブルシューティングコマンド

### キャッシュクリア
```bash
# node_modules 再インストール
rm -rf node_modules && pnpm install

# TypeScript キャッシュクリア
pnpm typecheck --build --clean

# ビルドキャッシュクリア
pnpm f build --clean
```

### ログ・デバッグ
```bash
# 詳細ログ出力
pnpm b dev --verbose    # バックエンド詳細ログ
pnpm f dev --verbose    # フロントエンド詳細ログ

# テストデバッグ
pnpm b test:unit --reporter=verbose   # 詳細テスト結果
pnpm e2e test --debug                 # E2Eテストデバッグ
```

### 依存関係確認
```bash
# 依存関係ツリー
pnpm list               # ルートレベル依存関係
pnpm b list             # バックエンド依存関係  
pnpm f list             # フロントエンド依存関係

# 古い依存関係チェック
pnpm outdated           # 更新可能パッケージ確認
```

## パフォーマンス分析コマンド

### ビルド分析
```bash
# バンドルサイズ分析
pnpm f build --analyze  # webpack-bundle-analyzer相当

# ビルド時間分析
time pnpm f build       # ビルド時間測定
```

### テスト分析
```bash
# テストカバレッジ
pnpm b test:unit --coverage    # バックエンドカバレッジ
pnpm f test:unit --coverage    # フロントエンドカバレッジ

# テスト実行時間
pnpm test:unit --reporter=min  # 最小限レポート
```

## 効率化のためのエイリアス提案

```bash
# .bashrc / .zshrc に追加推奨
alias pnpm-dev-start="pnpm b dev & pnpm f dev"
alias pnpm-check="pnpm typecheck && pnpm -r lint"
alias pnpm-test-all="pnpm test:unit && pnpm test:api"
alias pnpm-full-check="pnpm check-all"
```