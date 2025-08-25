# 型安全性戦略

## エンドツーエンド型安全性の実現

このプロジェクトの最大の特徴は、バックエンドからフロントエンドまでの完全な型安全性を実現していることです。

## 型の流れ（Type Flow）

### 1. バックエンドでの型定義 
**ファイル**: `workspaces/back/src/presentation/app.ts`

```typescript
// Honoアプリケーションの型を生成
export type AppType = ReturnType<typeof createApp>
```

**重要ポイント**:
- Honoの`createApp()`関数の戻り値型を自動抽出
- APIルートの定義変更が即座に型に反映
- 手動での型定義メンテナンス不要

### 2. フロントエンドでの型取得
**ファイル**: `workspaces/front/app/types/shared.ts`

```typescript
import type { AppType } from "../../../back/src/presentation/app"

export type ClientType = AppType
export type { TodoDto } from "../../../back/src/application/dto/TodoDto"
```

**重要ポイント**:
- バックエンドの型を直接インポート
- `ClientType`として再エクスポートしてフロントエンド内で使用
- DTOも同様に共有

### 3. 型付きクライアントの作成
**ファイル**: `workspaces/front/app/client.ts`

```typescript
import { hc } from "hono/client"
import type { ClientType } from "./types/shared"

// 完全に型付けされたAPIクライアント
const createBrowserClient = (baseURL: string) => hc<ClientType>(baseURL)
const createServerFetcher = (baseURL: string) => hc<ClientType>(baseURL)
```

**重要ポイント**:
- Hono の `hc<ClientType>()` で型付きクライアント作成
- ブラウザ・サーバー両方の環境に対応
- 全APIエンドポイントが型安全

## TypeScript設定による型安全性強化

### バックエンド型設定 (`workspaces/back/tsconfig.json`)
```json
{
  "compilerOptions": {
    "strict": true,              // 最も厳密な型チェック
    "target": "ESNext",          // 最新のJS機能を活用
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,        // 外部ライブラリの型エラーを無視
    "types": ["@cloudflare/workers-types/2023-07-01"]  // Workers型定義
  }
}
```

### フロントエンド型設定 (`workspaces/front/tsconfig.json`)
```json
{
  "compilerOptions": {
    "strict": true,                    // 厳密な型チェック
    "checkJs": true,                   // JavaScript も型チェック
    "verbatimModuleSyntax": true,      // import/export 構文の厳密化
    "noEmit": true,                    # コンパイル出力なし（型チェックのみ）
    "types": ["./worker-configuration.d.ts"]  // Cloudflare Pages型
  }
}
```

## 実際の型安全性の効果

### APIクライアント使用例
```typescript
// フロントエンドでの使用例
const client = createBrowserClient("https://api.example.com")

// 完全に型付けされたAPIコール
const todo = await client.api.v1.todos.$get()
//    ↑ TodoDto[] 型で推論される

const newTodo = await client.api.v1.todos.$post({
  json: {
    title: "New Todo",     // ✅ 正しい型
    completed: false       // ✅ 正しい型
    // invalid: "field"    // ❌ コンパイルエラー
  }
})
```

### React Router v7 での活用
```typescript
// app/routes/todos/index.tsx
export async function loader({ context }: LoaderFunctionArgs) {
  const client = createServerFetcher(context.cloudflare.env.API_URL)
  
  // 型安全なサーバーサイドデータ取得
  const todos = await client.api.v1.todos.$get()
  //    ↑ TodoDto[] 型が保証される
  
  return json({ todos: todos.json() })
}
```

## バリデーション戦略

### Zodによるランタイムバリデーション
**バックエンドAPI**: `@hono/zod-validator`

```typescript
// workspaces/back/src/presentation/api/v1/todos/post.ts
const createTodoValidator = zValidator('json', z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional()
}))

app.post('/todos', createTodoValidator, async (c) => {
  const data = c.req.valid('json')  // 型安全かつランタイム検証済み
  // ...
})
```

**効果**:
- コンパイル時型チェック + ランタイムバリデーション
- 不正なリクエストの事前検出
- APIの仕様変更時の自動的な型反映

## 型安全性のメリット

### 1. 開発時の利便性
- **IntelliSense**: APIの全エンドポイントで完全な補完
- **リファクタリング**: API変更時のフロントエンドへの影響を自動検出
- **ドキュメント**: 型定義自体がAPIドキュメントの役割

### 2. ランタイムエラーの防止
- **存在しないエンドポイント**: コンパイル時に検出
- **不正なパラメータ**: 型エラーで事前防止
- **レスポンス型の不整合**: 型推論で自動解決

### 3. 保守性の向上
- **変更の追跡**: バックエンド変更がフロントエンドに自動反映
- **テストの信頼性**: 型安全なモック作成
- **コードレビュー**: 型レベルでの整合性確認

## 型安全性チェック体制

### 開発フロー
1. **コード変更**: バックエンドAPIの修正
2. **型チェック**: `pnpm typecheck` で全体チェック
3. **エラー検出**: フロントエンドでのコンパイルエラー
4. **修正**: フロントエンドコードの対応
5. **再チェック**: 型安全性の確認

### CI/CD での自動化
```bash
# package.json での品質チェック
"check-all": "pnpm -r lint && pnpm run typecheck && pnpm test:unit && pnpm test:api && pnpm test:e2e"
```

**チェック項目**:
- 型チェック（`pnpm typecheck`）
- リント（ESLint）
- 単体テスト
- API統合テスト
- E2Eテスト

## 課題と対策

### 型定義の複雑化対策
- **型の分割**: 複雑な型は小さな型に分解
- **ジェネリクス活用**: 再利用可能な型定義
- **型ガード**: ランタイムでの型安全性確保

### パフォーマンス対策
- **skipLibCheck**: 外部ライブラリの型チェック無効化
- **incremental**: 増分コンパイル有効化
- **型推論の最適化**: 適切な型注釈でコンパイル高速化

### 学習コストの軽減
- **型定義の文書化**: 重要な型にコメント追加
- **サンプルコード**: 型使用例の提供
- **段階的導入**: 新機能から型安全性を強化