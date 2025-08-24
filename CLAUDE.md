# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code)にガイダンスを提供します。

## プロジェクト構造

これは、pnpm ワークスペースモノレポを使用したフルスタックCloudflare Todoアプリケーションです：

- **back/**: Cloudflare Workersにデプロイされる Hono ベースのAPIサーバー（詳細は @back/CLAUDE.md を参照）
- **front/**: Cloudflare Pagesにデプロイされる React Router v7 SSRアプリケーション（詳細は @front/CLAUDE.md を参照）
- **shared/**: フロントエンドとバックエンド間で共有される型定義
- **e2e/**: Playwrightを使用したE2Eテスト（詳細は @e2e/CLAUDE.md を参照）

## 開発コマンド

### ルートレベル
```bash
# 依存関係をインストール
pnpm install

# バックエンドで作業
pnpm b [command]

# フロントエンドで作業
pnpm f [command]

# E2Eテストで作業
pnpm e2e [command]

# 両方の型チェックを実行
pnpm typecheck

# ルートレベルから直接実行可能な便利コマンド
pnpm b dev                # バックエンド開発サーバー起動
pnpm f dev                # フロントエンド開発サーバー起動
pnpm b test:unit          # バックエンド単体テスト実行
pnpm b test:api           # API統合テスト実行
pnpm test:e2e             # E2Eテスト実行（DB/バケットリセット含む）
```

### ワークスペース固有コマンド
各ワークスペースの詳細なコマンドについては、以下の個別ドキュメントを参照してください：
- **バックエンド**: @back/CLAUDE.md
- **フロントエンド**: @front/CLAUDE.md 
- **E2Eテスト**: @e2e/CLAUDE.md

## アーキテクチャ概要

### 全体アーキテクチャ
このプロジェクトは、Cloudflareプラットフォーム上で動作するフルスタックアプリケーションです。各ワークスペースの詳細なアーキテクチャについては、以下を参照してください：

- **バックエンド**: オニオンアーキテクチャによるHono API（詳細は @back/CLAUDE.md）
- **フロントエンド**: React Router v7 SSRアプリケーション（詳細は @front/CLAUDE.md）
- **E2Eテスト**: Playwrightによる統合テスト（詳細は @e2e/CLAUDE.md）

### 型共有戦略
- バックエンドルートが`src/presentation/app.ts`から`AppType`をエクスポート
- `shared/client.ts`がこれを`ClientType`として再エクスポート
- フロントエンドが完全に型付けされたAPIクライアント用に`hc<ClientType>()`を使用
- これによりバックエンドからフロントエンドへのエンドツーエンドの型安全性を実現

### 環境設定
両アプリはWranglerを環境固有の設定で使用：
- **local**: `http://localhost:5173` CORS origin
- **dev**: `https://todo-front-dev.omen-bt.workers.dev` CORS origin  
- **prd**: `https://todo-front-prd.omen-bt.workers.dev` CORS origin

## 重要なファイル

### プロジェクト全体
- `shared/client.ts` - バックエンドとフロントエンド間の型ブリッジ
- `**/wrangler.jsonc` - Cloudflare Workers設定
- `pnpm-workspace.yaml` - pnpmワークスペース設定

### ワークスペース固有のファイル
各ワークスペースの重要なファイルについては、以下の個別ドキュメントを参照してください：
- **バックエンド**: @back/CLAUDE.md
- **フロントエンド**: @front/CLAUDE.md 
- **E2Eテスト**: @e2e/CLAUDE.md

## 開発ワークフロー

### 全体的な開発フロー
1. バックエンドの変更: 型は自動的にフロントエンドに流れる（型共有戦略による）
2. フロントエンドの変更: 型付きクライアントで完全なIntelliSenseが利用可能
3. 両アプリはホットリロードで同時に開発可能
4. Cloudflare Workers（バックエンド）とPages（フロントエンド）に別々にデプロイ
5. 変更前に品質チェックを実行

### タスク完了時のチェックリスト
1. `pnpm typecheck` - 型エラーがないこと
2. `pnpm b lint` && `pnpm f lint` - リントエラーがないこと  
3. `pnpm b test:unit` - 単体テストが通ること
4. `pnpm b test:api` - API統合テストが通ること
5. `pnpm test:e2e` - E2Eテストが通ること（UI変更時）

### ワークスペース固有のワークフロー
各ワークスペースの詳細なワークフローについては、以下を参照してください：
- **バックエンド**: @back/CLAUDE.md
- **フロントエンド**: @front/CLAUDE.md 
- **E2Eテスト**: @e2e/CLAUDE.md

## メモリ

### 重要な指示と注意点
- 常に日本語で応答する
- 求められたことを行う。それ以上でも以下でもない。
- ローカルサーバは手動で起動済みなので、動作確認時に起動しなおす必要ない
- rmを実行したい時は代わりにgit rmを利用する
- mvを実行したい時は代わりにgit mvを利用する
- ツールの結果を受け取った後、その品質を慎重に検討し、次に進む前に最適な次のステップを決定してください。この新しい情報に基づいて計画し、反復するために思考を使用し、最善の次のアクションを取ってください。
- 最大の効率を得るために、複数の独立した操作を実行する必要がある場合は、順次ではなく、関連するすべてのツールを同時に呼び出してください。
- 反復のために一時的な新しいファイル、スクリプト、またはヘルパーファイルを作成した場合は、タスクの最後にこれらのファイルを削除してクリーンアップしてください。
- TSDocを必ず記載してください