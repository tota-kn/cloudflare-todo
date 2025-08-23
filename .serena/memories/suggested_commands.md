# 開発コマンド一覧

## インストール・初期化
```bash
pnpm install                  # 依存関係をインストール
pnpx playwright install       # Playwrightブラウザをインストール
```

## 開発サーバー起動
```bash
pnpm b dev                    # バックエンド開発サーバー起動（localhost:8787）
pnpm f dev                    # フロントエンド開発サーバー起動（localhost:5173）
```

## 型チェック・リント・フォーマット
```bash
pnpm typecheck               # 両方の型チェック実行
pnpm b typecheck             # バックエンド型チェック
pnpm f typecheck             # フロントエンド型チェック
pnpm b lint                  # バックエンドリント・フォーマット
pnpm f lint                  # フロントエンドリント・フォーマット
```

## テスト実行
```bash
pnpm b test:unit             # バックエンド単体テスト実行
pnpm b test:unit:watch       # バックエンド単体テストウォッチモード
pnpm b test:api              # API統合テスト実行（Bruno）
pnpm test:e2e                # E2Eテスト実行
pnpm e2e test:ui             # PlaywrightのUIモードでテスト
```

## データベース・バケット操作
```bash
pnpm b db:migrate            # D1データベースマイグレーション適用
pnpm b db:reset              # テストデータでデータベースリセット
pnpm b bucket:reset          # R2バケットリセット
```

## ビルド・デプロイ
```bash
pnpm f build                 # フロントエンドビルド
pnpm f preview               # ビルド結果のプレビュー
pnpm b deploy:dev            # バックエンドをdev環境にデプロイ
pnpm b deploy:prd            # バックエンドをproduction環境にデプロイ
pnpm f deploy:dev            # フロントエンドをdev環境にデプロイ
pnpm f deploy:prd            # フロントエンドをproduction環境にデプロイ
```

## 型生成
```bash
pnpm b typegen               # Cloudflare環境の型を生成（バックエンド）
pnpm f typegen               # Cloudflare環境の型を生成（フロントエンド）
```

## 便利なワークスペースコマンド
```bash
pnpm b [command]             # バックエンドでコマンド実行
pnpm f [command]             # フロントエンドでコマンド実行
pnpm e2e [command]           # E2Eでコマンド実行
```

## 推奨開発ワークフロー
1. `pnpm b dev` & `pnpm f dev` で両方の開発サーバー起動
2. コード変更後は `pnpm typecheck` で型チェック
3. `pnpm b lint` でコード品質確認
4. テスト実行: `pnpm b test:unit` → `pnpm b test:api`
5. E2Eテスト: `pnpm test:e2e`