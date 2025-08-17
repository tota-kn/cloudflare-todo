# プロジェクト概要

## プロジェクトの目的
Cloudflare Todo - Cloudflare Workers/PagesとReact Router v7を使用したフルスタックTodoアプリケーション

## アーキテクチャ
- **モノレポ構成**: pnpmワークスペースを使用
- **バックエンド**: Cloudflare Workersで動作するHono APIサーバー
- **フロントエンド**: Cloudflare PagesにデプロイされるReact Router v7 SSRアプリケーション
- **共有**: フロントエンドとバックエンド間の型定義

## 技術スタック
### バックエンド
- **フレームワーク**: Hono with TypeScript
- **アーキテクチャ**: オニオンアーキテクチャ（Domain/Application/Infrastructure/Presentation）
- **データベース**: Cloudflare D1 with Drizzle ORM
- **ストレージ**: Cloudflare R2
- **バリデーション**: Zod with @hono/zod-validator
- **API文書**: @hono/swagger-ui
- **テスト**: Bruno APIテスト

### フロントエンド
- **フレームワーク**: React Router v7 with SSR
- **スタイリング**: TailwindCSS
- **状態管理**: TanStack Query
- **テーマ**: ライト/ダークモード対応
- **型安全性**: Hono RPCクライアントによるエンドツーエンド型安全性

### 共有
- 型定義の共有によるフロントエンド・バックエンド間の型安全性確保