# CLAUDE.md

このファイルは、このリポジトリで作業する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

このプロジェクトは、React Router v7で構築されたフルスタックReactアプリケーションで、サーバーサイドレンダリング（SSR）アプリケーションとしてCloudflare Workers上で動作するよう設計されています。グローバル配信とパフォーマンスのためにエッジコンピューティングを使用しています。

## 開発コマンド

**基本的な開発:**
- `pnpm run dev` - HMR付き開発サーバーを起動
- `pnpm run build` - プロダクション用ビルド
- `pnpm run typecheck` - TypeScript型チェックを実行
- `pnpm run preview` - プロダクションビルドをローカルでプレビュー

**Cloudflare固有:**
- `pnpm run deploy` - ビルドしてCloudflare Workersにデプロイ
- `pnpm run cf-typegen` - Cloudflare Workers TypeScript型を生成

**注意:** このプロジェクトは`npm`ではなく`pnpm`をパッケージマネージャーとして使用します。

## アーキテクチャ

**メインアプリケーションディレクトリ:** `my-react-router-app/`

**主要ディレクトリ:**
- `app/` - ファイルベースルーティングを使用するメインReactアプリケーションコード
- `workers/` - Cloudflare Workersエントリーポイント (`app.ts`)
- `app/routes/` - ページコンポーネント (React Router v7ファイルベースルーティング)

**エントリーポイント:**
- クライアント: 標準的なReact Routerアプリ構造
- サーバー: `workers/app.ts` - すべてのリクエストを処理するCloudflare Worker

**技術スタック:**
- React 19.1.0 + React Router v7 (SSRとルーティング)
- TypeScript (型安全性)
- TailwindCSS v4 (スタイリング)
- Vite (ビルドツール)
- Cloudflare Workers (サーバーレスデプロイメント)

## 設定ファイル

- `wrangler.jsonc` - Cloudflare Workers設定と環境変数
- `react-router.config.ts` - SSRとVite環境APIを有効化
- `vite.config.ts` - Cloudflareプラグイン付きビルド設定
- `tsconfig.*.json` - TypeScriptプロジェクトリファレンス設定

## 重要な注意事項

- アプリケーションは従来のサーバーではなく、Cloudflareのエッジネットワーク上で動作します
- 環境変数はCloudflareの環境システムを通じてアクセスされます
- ReactコンポーネントはCloudflare Workers上でサーバーレンダリングされます
- デプロイ前にTypeScriptエラーをキャッチするため、常に`typecheck`を実行してください
- ビルドプロセスはWorkers用に最適化されたクライアントとサーバーの両方のバンドルを生成します