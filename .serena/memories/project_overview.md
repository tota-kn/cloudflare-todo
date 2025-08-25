# プロジェクト概要

## 基本情報

**プロジェクト名**: cloudflare-todo  
**タイプ**: フルスタックCloudflare Todoアプリケーション（pnpmワークスペースモノレポ）  
**主要技術**: TypeScript, Cloudflare Workers/Pages, Hono, React Router v7

## ワークスペース構成

### 1. バックエンド (workspaces/back/)
- **フレームワーク**: Hono + TypeScript
- **デプロイ先**: Cloudflare Workers
- **データベース**: Cloudflare D1
- **ストレージ**: Cloudflare R2
- **アーキテクチャ**: オニオンアーキテクチャ

### 2. フロントエンド (workspaces/front/)
- **フレームワーク**: React Router v7 (SSR)
- **デプロイ先**: Cloudflare Pages
- **スタイリング**: TailwindCSS v4
- **状態管理**: TanStack Query

### 3. E2Eテスト (workspaces/e2e/)
- **フレームワーク**: Playwright
- **テスト対象**: フルスタック統合テスト

## 共通基盤

### パッケージ管理
- **pnpm**: モノレポ管理とワークスペース
- **Node.js**: v22.14.0 (mise.toml指定)

### 型安全性
- バックエンドの`AppType`→フロントエンドの`ClientType`による完全な型共有
- エンドツーエンドの型安全性実現

### 環境
- **local**: 開発環境 (localhost)
- **dev**: 開発デプロイ環境
- **prd**: 本番環境

## 開発コマンド体系

### ルートレベル便利コマンド
```bash
pnpm b [command]    # バックエンドコマンド実行
pnpm f [command]    # フロントエンドコマンド実行
pnpm e2e [command]  # E2Eテストコマンド実行
pnpm typecheck      # 全体の型チェック
pnpm test:e2e       # E2Eテスト実行（DB/バケットリセット含む）
```

### 品質保証コマンド
```bash
pnpm check-all      # 全体の品質チェック（lint + typecheck + 全テスト）
```

## アーキテクチャ特徴

### 1. モノレポ設計
- 各ワークスペースが独立してデプロイ可能
- 型定義は相互依存しつつ、実行時は完全分離

### 2. Cloudflareエコシステム完全活用
- Workers（バックエンド）+ Pages（フロントエンド）
- D1（データベース）+ R2（ストレージ）
- 環境別設定によるスケーラブルなデプロイ

### 3. エンドツーエンド型安全性
- バックエンドのルート定義が自動的にフロントエンドで型付けされる
- ランタイムエラーを事前に防止

## 開発ワークフロー

1. バックエンド変更 → 型が自動的にフロントエンドへ流れる
2. フロントエンド開発時に完全なIntelliSense利用可能
3. 両アプリはホットリロードで同時開発
4. 品質チェック → 各環境への個別デプロイ