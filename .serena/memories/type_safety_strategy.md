# 型安全性戦略

## エンドツーエンド型安全性の仕組み

### 1. バックエンド型定義（back/src/）
```typescript
// back/src/presentation/app.ts
export type AppType = typeof app

// back/src/application/dto/TodoDto.ts  
export interface TodoDto {
  id: string
  title: string
  completed: boolean
  // ...
}
```

### 2. 型ブリッジ（shared/client.ts）
```typescript
import type { TodoDto } from "../back/dist/types/src/application/dto/TodoDto"
import type { AppType } from "../back/dist/types/src/presentation/app"

export type ClientType = AppType
export type TodoItem = TodoDto
```

### 3. フロントエンド型利用（front/app/）
```typescript
// front/app/client.ts
import { hc } from 'hono/client'
import type { ClientType } from '../../shared/client'

const createBrowserClient = () => hc<ClientType>(API_BASE_URL)
```

## 型生成ワークフロー

### バックエンド
1. `pnpm b typegen`: Cloudflare環境型生成
2. `pnpm b typecheck`: TypeScript宣言ファイル生成（`dist/types/`）
3. 生成された型をsharedで参照可能

### フロントエンド
1. `pnpm f typegen`: Cloudflare環境型生成
2. `react-router typegen`: React Router型生成
3. `tsc -b`: TypeScript型チェック

## Hono RPC クライアント
- **完全な型安全性**: バックエンドのルート定義から自動的に型推論
- **IntelliSense対応**: IDEで補完・型チェックが効く
- **リクエスト/レスポンス**: すべて型付き

```typescript
// 使用例
const client = createBrowserClient()
const response = await client.api.v1.todos.$post({
  json: { title: 'New Todo', completed: false }
})
// response は完全に型付きされている
```

## Zodバリデーション
- **スキーマ定義**: Zodでリクエスト/レスポンススキーマを定義
- **自動型生成**: Zodスキーマから自動的にTypeScript型が生成
- **ランタイム検証**: 型安全性 + 実行時バリデーション

## 型安全性のメリット
1. **開発時エラー検出**: バックエンド変更時にフロントエンドでコンパイルエラー
2. **リファクタリング安全性**: 型による変更影響範囲の把握
3. **API契約の明確化**: インターフェース変更の影響が即座に判明
4. **開発効率**: 自動補完によるコーディング速度向上