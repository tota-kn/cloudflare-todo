# CLAUDE.md

E2E テストワークスペース固有のガイダンス。設定値（ブラウザ・タイムアウト・リトライなど）は `playwright.config.ts` を見る。

## 前提

フロントエンド・バックエンド両方の開発サーバーが起動済みで、DB にテストデータがシード済みであること（`pnpm b db:reset`。ルートの `pnpm test:e2e` は自動で実行する）。

## 認証

実際の Google OAuth は使わない。`setup/global-setup.ts`（globalSetup）がシード済みセッション（`workspaces/back/migrations/0002_seed_test_data.sql` の `test-session-token-001` / test-user-001）の署名済み Cookie を `workspaces/back/.dev.vars` の `BETTER_AUTH_SECRET` から計算し、`tests/.auth/user.json`（storageState、gitignore 済み）に書き出す。全テストはログイン済み状態で始まる。

## コマンド

```bash
pnpm test                                       # line レポーターで実行
pnpm test:ui                                    # UI モード
pnpm exec playwright test tests/todo-crud.spec.ts  # 単一ファイル
```

## テストの書き方

- 操作は `helpers/ui-helpers.ts` の `TodoUIヘルパー` に集約し、スペックからはヘルパーを呼ぶ
- ヘルパーのメソッド名は日本語（`Todoページへ移動()`, `Todo保存()` など）。ロケータメソッド（要素取得）とアクションメソッド（操作）に分ける
- ページ遷移後は `waitForLoadState("networkidle")` で安定させる。URL マッチングは正規表現
- `/en/todos`（英語ロケール）で実行する。テストデータは日本語テキスト
- 各テストはシーケンシャルフロー（例: 作成 → 表示確認 → 編集 → 表示確認 → 完了 → 完了確認）

### 並列実行の安全性

`fullyParallel: true` で全テストが同一 DB を共有するため：

- 各テストは `Date.now()` サフィックス付きのユニークなタイトルで自前の Todo を作って操作する
- Todo アイテム内のボタン操作は `Todoアイテム取得(title)` でタイトルスコープする（`.first()` は他テストの Todo に誤爆する）
- シードデータの既存 Todo には依存しない（一覧が空でないことだけ前提にできる）
