# Todoリストのユーザー別管理 実装計画

## Context

現在、todosテーブルに`user_id`カラムがなく、すべてのTodoが全ユーザーで共有されている。BetterAuth認証は既に設定済み（Google OAuth、セッション管理）だが、TodoエンドポイントはUser認証なしで誰でもアクセス可能。この変更により、認証済みユーザーごとにTodoを分離管理する。

---

## 実装ステップ

### 1. D1マイグレーション

**新規**: `workspaces/back/migrations/0004_add_user_id_to_todos.sql`

- todosテーブルを再作成（SQLiteの制約上、NOT NULL外部キーの追加にはテーブル再作成が必要）
- `user_id TEXT NOT NULL` + `FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE`
- インデックス: `idx_todos_user_id`, `idx_todos_user_completed`（複合）
- 既存データは`user_id`不明のため移行しない

**新規**: `workspaces/back/migrations/0005_reset_and_seed_test_data_v2.sql`

- テストユーザー2名を`user`テーブルに作成
- 既存テストデータをuser_id付きで再投入（ユーザー分離テスト用にuser2のデータも追加）

### 2. ドメイン層

**変更**: `workspaces/back/src/domain/entities/Todo.ts`

- コンストラクタに`userId: string`プロパティを追加
- `create(id, title, desc?)` → `create(id, userId, title, desc?)`
- `fromData`に`user_id`フィールド追加
- `getUserId(): string`ゲッターを追加

### 3. アプリケーション層

**変更**: `workspaces/back/src/application/repositories/ITodoRepository.ts`

- `findById(id, userId)` / `findAll(userId)` / `delete(id, userId)` にuserId追加
- `save`/`update`はTodoエンティティにuserIdが含まれるため変更なし

**変更**: 各ユースケース（`workspaces/back/src/application/usecases/`）

| ユースケース | 変更内容 |
|---|---|
| `CreateTodoUseCase.ts` | `CreateTodoRequest`に`userId`追加 |
| `ListTodosUseCase.ts` | `execute(userId: string)` |
| `GetTodoUseCase.ts` | `execute(id, userId)` |
| `UpdateTodoUseCase.ts` | `UpdateTodoRequest`に`userId`追加 |
| `DeleteTodoUseCase.ts` | `execute(id, userId)` |

**変更なし**: `workspaces/back/src/application/dto/TodoDto.ts` — APIレスポンスにuser_idは不要

### 4. インフラストラクチャ層

**変更**: `workspaces/back/src/infrastructure/database/todoTable.ts`

- `userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })` 追加

**変更**: `workspaces/back/src/infrastructure/repositories/D1TodoRepository.ts`

- `save`: userId挿入追加
- `findById`: `and(eq(id), eq(userId))` でWHERE条件追加
- `findAll`: `where(eq(userId))` でフィルタリング
- `update`: WHERE条件に`eq(userId)` 追加
- `delete`: WHERE条件に`eq(userId)` 追加
- `drizzle-orm`から`and`をimport

### 5. プレゼンテーション層

**新規**: `workspaces/back/src/presentation/middleware/authMiddleware.ts`

- BetterAuthの`auth(env).api.getSession({ headers })`でセッション検証
- 認証済み → `c.set("userId", session.user.id)`
- 未認証 → `401 Unauthorized`を返す

**変更**: 各ルートハンドラ（`workspaces/back/src/presentation/api/v1/todos/`）

- 5つ全てのルートに`authMiddleware`を適用
- Honoの型に`Variables: { userId: string }`を追加
- `c.get("userId")`でユーザーIDを取得し、ユースケースに渡す

対象ファイル:
- `workspaces/back/src/presentation/api/v1/todos/get.ts`
- `workspaces/back/src/presentation/api/v1/todos/post.ts`
- `workspaces/back/src/presentation/api/v1/todos/_todoId/get.ts`
- `workspaces/back/src/presentation/api/v1/todos/_todoId/put.ts`
- `workspaces/back/src/presentation/api/v1/todos/_todoId/delete.ts`

### 6. フロントエンド

**変更**: `workspaces/front/app/client.ts`

- `createServerFetcher(env, headers?)`にheaders引数追加（Cookie転送用）

**変更**: 各ルートのloader/action

- `request.headers.get("Cookie")`を取得し、`createServerFetcher`に渡す
- 401レスポンスのハンドリング追加（未認証時はログインを促す表示）

対象ファイル:
- `workspaces/front/app/routes/$lang/todos/index.tsx` — loaderで401時に`isAuthenticated: false`を返し、UIで「ログインしてください」表示
- `workspaces/front/app/routes/$lang/todos/new.tsx` — loaderで401時にtodosページへリダイレクト
- `workspaces/front/app/routes/$lang/todos/$id.tsx` — loaderで401時にtodosページへリダイレクト

**変更**: `workspaces/front/app/hooks/useTodos.ts`

- ブラウザ側APIコールで401レスポンス時の処理追加（空配列を返す or エラー表示）

**変更**: i18n翻訳ファイル

- `workspaces/front/app/locales/en/common.json`: `"Please sign in to view your todos"` 追加
- `workspaces/front/app/locales/ja/common.json`: `"Todoを表示するにはログインしてください"` 追加

### 7. テスト更新

**変更**: `workspaces/back/test/unit/mocks/MockTodoRepository.ts`

- `findById(id, userId)` / `findAll(userId)` / `delete(id, userId)` にuserIdフィルタリング追加

**変更**: `workspaces/back/test/unit/mocks/TestFactory.ts`

- `createTodo`に`userId`パラメータ追加（デフォルト値: `"test-user-001"`）
- `createTodoFromData`にも`user_id`追加

**変更**: 各ユースケーステスト（`workspaces/back/test/unit/application/usecases/*.test.ts`）

- 全テストにuserId追加
- ユーザー分離テスト追加（他ユーザーのTodoにアクセスできないことの確認）

**変更**: `workspaces/back/test/unit/domain/entities/Todo.test.ts`

- `Todo.create`呼び出しにuserId追加、`getUserId()`テスト追加

---

## 実装順序

1. マイグレーション作成（0004, 0005）
2. ドメイン層（Todo.ts）
3. アプリケーション層（ITodoRepository, ユースケース）
4. インフラストラクチャ層（todoTable.ts, D1TodoRepository.ts）
5. テスト更新 → `pnpm b test:unit` で確認
6. プレゼンテーション層（authMiddleware, ルートハンドラ）
7. フロントエンド（client.ts, loader/action, useTodos.ts, i18n）
8. マイグレーション適用 → `pnpm b db:migrate`

---

## 検証方法

1. `pnpm typecheck` — 型エラーがないこと
2. `pnpm b lint && pnpm f lint` — リントエラーがないこと
3. `pnpm b test:unit` — 単体テスト通過
4. `pnpm b db:reset` — マイグレーション適用確認
5. ブラウザで動作確認:
   - 未ログイン時: Todo一覧ページでログインを促すメッセージ表示
   - ログイン後: 自分のTodoのみ表示・作成・編集・削除可能
   - 別ユーザーでログイン: 別のTodoリストが表示される
