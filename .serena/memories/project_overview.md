# プロジェクト概要

## プロジェクトの目的
Cloudflare TodoアプリケーションはCloudflareのサーバーレス技術を活用したフルスタックTodoアプリケーションです。

## 技術スタック
### 全体
- **モノレポ管理**: pnpm workspace
- **デプロイメント**: Cloudflare Workers（バックエンド）& Cloudflare Pages（フロントエンド）

### バックエンド（back/）
- **フレームワーク**: Hono with TypeScript
- **アーキテクチャパターン**: オニオンアーキテクチャ（Clean Architecture）
- **データベース**: Cloudflare D1（SQLite）
- **ORM**: Drizzle ORM
- **ストレージ**: Cloudflare R2（ファイルアップロード）
- **バリデーション**: Zod + @hono/zod-validator
- **API仕様**: OpenAPI（@hono/zod-openapi）
- **テスト**: Vitest（単体テスト）+ Bruno（API統合テスト）

### フロントエンド（front/）
- **フレームワーク**: React Router v7（SSR対応）
- **スタイリング**: TailwindCSS v4
- **状態管理**: TanStack Query（サーバー状態）+ React Context（テーマ）
- **型安全性**: Hono RPC Client（バックエンドとの型共有）

### 型共有（shared/）
- バックエンドの型をフロントエンドに橋渡しするclient.ts

### E2Eテスト（e2e/）
- **テストフレームワーク**: Playwright

## 主要な特徴
- エンドツーエンドの型安全性（バックエンド→フロントエンド）
- オニオンアーキテクチャによる関心の分離
- Cloudflareエコシステムの活用
- ダークモード対応
- ファイルアップロード機能