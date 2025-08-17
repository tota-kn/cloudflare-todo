# コードスタイル・規約

## TypeScript設定
- 厳格なTypeScript設定
- 宣言ファイル生成有効（`--declaration --emitDeclarationOnly`）

## ESLint設定（バックエンド）
- `@eslint/js` + `typescript-eslint` + `@stylistic/eslint-plugin`
- オニオンアーキテクチャ依存関係強制ルール
- Import/Exportパス制限

## コーディング規約
### バックエンド
- **ファイル命名**: PascalCase（クラス）、camelCase（関数・変数）
- **ディレクトリ構造**: 層別に明確に分離
- **依存性注入**: Dependenciesクラス経由で管理
- **バリデーション**: Zodスキーマ使用
- **エラーハンドリング**: 適切なHTTPステータスコード

### フロントエンド
- **コンポーネント**: PascalCaseでファイル名・コンポーネント名
- **フック**: `use`プレフィックス
- **型定義**: インターフェース・型エイリアス適切に使い分け
- **スタイリング**: TailwindCSSクラス使用

## ファイル構成パターン
### バックエンドルート
```typescript
// バリデーションスキーマ定義
export const createTodoSchema = z.object({...})

// ルートハンドラー関数
export const v1TodosPost = (deps: Dependencies) => 
  createRoute({
    // OpenAPI仕様
    // バリデーション
    // ハンドラー実装
  })
```

### フロントエンドコンポーネント
```typescript
interface ComponentProps {
  // props定義
}

export function Component({ ...props }: ComponentProps) {
  // 実装
}
```

## 命名規則
- **API エンドポイント**: RESTful（GET /v1/todos, POST /v1/todos, etc.）
- **データベーステーブル**: スネークケース（`todos_table`）
- **TypeScript**: camelCase（変数・関数）、PascalCase（型・クラス・インターフェース）