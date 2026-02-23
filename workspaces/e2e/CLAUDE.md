# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルはE2Eテストワークスペース固有のClaude Codeガイダンスを提供します。

## テストアーキテクチャ

- **フレームワーク**: Playwright with TypeScript
- **ブラウザ**: Chromium のみ（playwright.config.tsで他はコメントアウト）
- **baseURL**: `http://localhost:5173`（フロントエンド開発サーバー）
- **タイムアウト**: 10秒、リトライ: 2回（CI時）
- **トレース**: 初回リトライ時に記録
- **前提条件**: フロントエンド・バックエンド両方の開発サーバーが起動済みであること

### ディレクトリ構成

- `tests/` - テストスペック（現在 `todo-crud.spec.ts` のみ）
- `helpers/` - テストヘルパークラス（`ui-helpers.ts`）
- `tests/.auth/` - 認証情報保存用ディレクトリ

## 開発コマンド

```bash
pnpm test              # Playwrightテスト実行（line レポーター）
pnpm test:ui           # UIモードでインタラクティブにテスト実行
pnpm lint              # ESLint + Prettier でコード品質チェック

# 単一テスト実行
npx playwright test tests/todo-crud.spec.ts

# テストレポート表示
npx playwright show-report

# テストコード自動生成
npx playwright codegen
```

## ヘルパークラスパターン

`helpers/ui-helpers.ts` にテスト操作を集約した `TodoUIヘルパー` クラスがある。

### 重要な規約

- **メソッド名は日本語**: `Todoページへ移動()`, `Todo保存()`, `Todo完了()` など
- **ロケータメソッド**（要素取得）と**アクションメソッド**（操作実行）に分離
- ページ遷移後は `waitForLoadState("networkidle")` で安定化
- URL マッチングに正規表現を使用

### 新規テスト作成時

1. 必要なロケータ/アクションを `TodoUIヘルパー` に追加
2. テストスペックからヘルパーメソッドを呼び出す
3. テストは `/en/todos`（英語ロケール）パスで実行

## テスト設計パターン

現在のテスト（`todo-crud.spec.ts`）はシーケンシャルフロー：
作成 → 表示確認 → 編集 → 表示確認 → 完了 → 完了確認

テストデータは日本語テキストを使用（例: "テスト Todo アイテム"）。
