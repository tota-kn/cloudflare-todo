# コードスタイル・規約

## コードフォーマット設定

### Prettier設定 (.prettierrc)
```json
{
  "semi": false,           // セミコロンなし
  "singleQuote": false,    // ダブルクォート使用
  "trailingComma": "es5",  // ES5互換の末尾カンマ
  "tabWidth": 2,           // インデント2スペース
  "useTabs": false         // スペース使用（タブ禁止）
}
```

### ESLint設定の特徴

#### 共通設定 (workspaces/*/eslint.config.mjs)
```javascript
export default [
  // TypeScript推奨ルール
  ...tseslint.configs.recommended,
  
  // インポートルール
  {
    plugins: { import: importPlugin },
    rules: {
      "import/order": ["error", {
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        "newlines-between": "always"
      }]
    }
  }
]
```

#### バックエンド固有ルール
```javascript
// オニオンアーキテクチャの依存方向強制
{
  "import/no-restricted-paths": [
    "error",
    {
      zones: [
        // ドメイン層：外部依存なし
        {
          target: "./src/domain",
          from: ["./src/application", "./src/infrastructure", "./src/presentation"]
        },
        // アプリケーション層：インフラ層に依存しない
        {
          target: "./src/application",
          from: ["./src/infrastructure", "./src/presentation"]
        }
      ]
    }
  ]
}
```

## ファイル・ディレクトリ命名規約

### ディレクトリ構造
```
src/
├── domain/              # ドメイン層（小文字）
├── application/         # アプリケーション層
├── infrastructure/      # インフラストラクチャ層
├── presentation/        # プレゼンテーション層
└── types/              # 型定義
```

### ファイル命名
- **TypeScript**: PascalCase.ts (例: `TodoService.ts`)
- **コンポーネント**: PascalCase.tsx (例: `TodoList.tsx`)
- **ユーティリティ**: camelCase.ts (例: `dateFormat.ts`)
- **テスト**: `*.test.ts` または `*.spec.ts`
- **設定ファイル**: kebab-case (例: `eslint.config.mjs`)

### API エンドポイント命名
```
api/v1/
├── todos/              # リソース名（複数形）
│   ├── get.ts         # HTTP メソッド名
│   ├── post.ts
│   └── _todoId/       # パラメータ（アンダースコア+camelCase）
│       ├── get.ts
│       ├── put.ts
│       └── delete.ts
└── assets/
    └── _filename/
        └── get.ts
```

## TypeScript コーディング規約

### 型定義規約

#### インターフェース vs Type Alias
```typescript
// インターフェース：拡張可能なオブジェクト型
interface Todo {
  id: string
  title: string
  completed: boolean
}

// Type Alias：ユニオン型、関数型、複雑な型
type TodoStatus = "pending" | "completed" | "archived"
type TodoFilter = (todo: Todo) => boolean
```

#### 命名規約
```typescript
// インターフェース：PascalCase
interface TodoRepository { }

// 型エイリアス：PascalCase  
type AppType = ReturnType<typeof createApp>

// ジェネリクス：T, U, V または意味のある名前
interface Repository<TEntity> { }
interface CreateUseCase<TRequest, TResponse> { }
```

### 関数・メソッド規約

#### 関数定義
```typescript
// アロー関数（推奨）
const createTodo = (title: string): Todo => {
  return new Todo({ title, completed: false })
}

// 非同期関数
const saveTodo = async (todo: Todo): Promise<void> => {
  await repository.save(todo)
}
```

#### メソッド定義
```typescript
class TodoService {
  // パブリックメソッド
  async createTodo(title: string): Promise<Todo> {
    return this.repository.create({ title })
  }
  
  // プライベートメソッド
  private validateTitle(title: string): void {
    if (!title.trim()) {
      throw new Error("Title cannot be empty")
    }
  }
}
```

### インポート・エクスポート規約

#### インポート順序
```typescript
// 1. Node.js標準ライブラリ
import { readFile } from "fs/promises"

// 2. 外部ライブラリ
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

// 3. 内部ライブラリ（上位層から）
import type { TodoDto } from "../../application/dto/TodoDto"
import { TodoService } from "../services/TodoService"

// 4. 相対インポート
import { validateTodo } from "./validators"
```

#### エクスポート規約
```typescript
// 名前付きエクスポート（推奨）
export const TodoService = class { }
export type TodoDto = { }

// デフォルトエクスポート（コンポーネントのみ）
export default function TodoList() { }
```

## React/JSX 規約

### コンポーネント定義
```typescript
// 関数コンポーネント（推奨）
interface TodoItemProps {
  todo: TodoDto
  onToggle: (id: string) => void
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <div className="todo-item">
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo.id)}>
        Toggle
      </button>
    </div>
  )
}
```

### JSX記述規約
```typescript
// 属性は改行で整理（多い場合）
<TodoItem
  todo={todo}
  onToggle={handleToggle}
  className="highlight"
  isSelected={isSelected}
/>

// 単純な場合は1行
<TodoItem todo={todo} onToggle={handleToggle} />
```

## エラーハンドリング規約

### バックエンドエラー
```typescript
// カスタムエラークラス
export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo with id ${id} not found`)
    this.name = "TodoNotFoundError"
  }
}

// エラーレスポンス
return c.json({ error: "Todo not found" }, 404)
```

### フロントエンドエラー
```typescript
// エラー境界での処理
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-message">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  )
}
```

## テストコード規約

### テストファイル構造
```typescript
// describe-it 構造
describe("TodoService", () => {
  describe("createTodo", () => {
    it("should create a new todo with valid title", async () => {
      // Arrange
      const title = "Test Todo"
      
      // Act
      const todo = await service.createTodo(title)
      
      // Assert
      expect(todo.title).toBe(title)
      expect(todo.completed).toBe(false)
    })
  })
})
```

### テスト命名
- **describe**: テスト対象（クラス名・関数名）
- **it/test**: 期待する動作 ("should ..." 形式)

## コメント・ドキュメント規約

### TSDoc コメント
```typescript
/**
 * Creates a new Todo item with the specified title.
 * 
 * @param title - The title of the todo item
 * @param description - Optional description for the todo
 * @returns A promise that resolves to the created Todo
 * @throws {ValidationError} When title is empty or invalid
 * 
 * @example
 * ```typescript
 * const todo = await createTodo("Buy groceries")
 * console.log(todo.id) // "uuid-string"
 * ```
 */
async function createTodo(
  title: string, 
  description?: string
): Promise<Todo> {
  // 実装
}
```

### インラインコメント
```typescript
// バリデーションロジック：空文字とスペースのみを拒否
if (!title.trim()) {
  throw new ValidationError("Title cannot be empty")
}

// TODO: 将来的にタグ機能を追加予定
// const tags: string[] = []
```

## 品質チェック体制

### 自動チェック
```bash
# ルートレベル品質チェック
pnpm check-all  # lint + typecheck + test

# 個別チェック
pnpm -r lint      # 全ワークスペース lint
pnpm typecheck    # 型チェック
```

### プリコミットフック
- コードフォーマット自動適用
- リントエラー検出
- 型チェック実行
- テスト実行