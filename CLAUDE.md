# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code)にガイダンスを提供します。

## プロジェクト構造

pnpm ワークスペースモノレポによるフルスタックCloudflare Todoアプリケーション。各ワークスペースの詳細は個別の CLAUDE.md を参照：

- **workspaces/back/**: Hono APIサーバー（Cloudflare Workers）— オニオンアーキテクチャ
- **workspaces/front/**: React Router v7 SSRアプリ（Cloudflare Pages）— TanStack Query + i18n
- **workspaces/e2e/**: Playwright E2Eテスト

## 開発コマンド

```bash
pnpm install              # 依存関係インストール

# ワークスペースへのコマンド委譲
pnpm b [command]          # バックエンド（例: pnpm b dev, pnpm b test:unit）
pnpm f [command]          # フロントエンド（例: pnpm f dev, pnpm f lint）
pnpm e2e [command]        # E2Eテスト

# 横断コマンド
pnpm typecheck            # back + front の型チェック
pnpm test:e2e             # DB/バケットリセット → E2Eテスト実行
pnpm check-all            # lint + typecheck + 全テスト（CI相当）
```

### タスク完了時のチェックリスト
1. `pnpm typecheck` — 型エラーがないこと
2. `pnpm b lint` && `pnpm f lint` — リントエラーがないこと
3. `pnpm b test:unit` — バックエンド単体テスト
4. `pnpm b test:api` — API統合テスト（Bruno）
5. `pnpm test:e2e` — E2Eテスト（UI変更時）

## アーキテクチャ概要

### 型共有戦略
バックエンドからフロントエンドへのエンドツーエンド型安全性：
1. バックエンド: `workspaces/back/src/presentation/app.ts` → `AppType`をエクスポート
2. フロントエンド: `workspaces/front/app/types/shared.ts` → `ClientType = AppType`として取得
3. フロントエンド: `hc<ClientType>()`で完全に型付けされたAPIクライアントを生成
4. バックエンドの型変更時は `pnpm b typecheck`（`tsc --declaration`）で型を再生成

### 環境設定
両アプリはWranglerで環境別設定を使用（`workspaces/*/wrangler.jsonc`）：
- **local**: localhost開発（back:8787, front:5173）
- **dev**: `https://todo.dev.totakn.com`
- **prd**: `https://todo.totakn.com`

### 認証
BetterAuth + Google OAuthによる認証。バックエンドでセッション管理、フロントエンドの認証必須ルートでは`requireAuth()`ヘルパーで未認証時にログインページへリダイレクト。

## 重要なファイル

- `workspaces/front/app/types/shared.ts` — バックエンドとフロントエンド間の型ブリッジ
- `workspaces/*/wrangler.jsonc` — Cloudflare Workers環境別設定
- `pnpm-workspace.yaml` — ワークスペース設定

## モデル使い分け（トークン節約）

メイン会話で Fable を使用している際は、トークン消費を抑えるため以下の方針でサブエージェントに委譲する：

- **広範囲のコード探索・複数ファイル横断調査**（結論だけ必要で過程のファイル内容は不要な検索）
  → Explore サブエージェントを `model: haiku` で起動して委譲する
- **設計判断・実装・コードレビュー・デバッグ**
  → メイン（Fable）が直接実行する
- **数ファイル以内の読み取り・単発の grep・小さな修正**
  → 委譲しない。サブエージェント起動はコンテキストをゼロから再構築するため、小タスクではかえってトークン消費が増える

## メモリ

### 重要な指示と注意点
- 常に日本語で応答する
- ローカルサーバは手動で起動済みなので、動作確認時に起動しなおす必要ない
- 反復のために一時的な新しいファイル、スクリプト、またはヘルパーファイルを作成した場合は、タスクの最後にこれらのファイルを削除してクリーンアップしてください
- TSDocを必ず記載してください