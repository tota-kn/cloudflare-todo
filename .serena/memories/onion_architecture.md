# オニオンアーキテクチャ実装詳細

## 層の定義と責務

### Domain層（`src/domain/`）
- **責務**: 純粋なビジネスロジック、ドメインルール
- **含むもの**:
  - `entities/`: ビジネスエンティティ（例: `Todo.ts`）
  - `value-objects/`: 値オブジェクト（例: `TodoId.ts`, `TodoStatus.ts`）
- **依存関係**: 他の層に依存しない（最も内側の層）
- **ESLint制御**: 他の層のimportを完全に禁止

### Application層（`src/application/`）
- **責務**: ユースケース実装、ビジネスフローの調整
- **含むもの**:
  - `usecases/`: ビジネスユースケース（例: `CreateTodoUseCase.ts`）
  - `repositories/`: リポジトリインターフェース（例: `ITodoRepository.ts`）
  - `dto/`: データ転送オブジェクト（例: `TodoDto.ts`）
- **依存関係**: Domain層のみ依存可能
- **ESLint制御**: Presentation/Infrastructure層のimportを禁止

### Infrastructure層（`src/infrastructure/`）
- **責務**: 外部システム（DB、ストレージ）との具体的な接続
- **含むもの**:
  - `repositories/`: リポジトリ実装（例: `D1TodoRepository.ts`）
  - `database/`: データベーステーブル定義（Drizzle）
  - `storage/`: ファイルストレージ実装
- **依存関係**: Domain, Application層に依存可能
- **ESLint制御**: Presentation層のimportを禁止

### Presentation層（`src/presentation/`）
- **責務**: HTTPリクエスト/レスポンス処理、API定義
- **含むもの**:
  - `api/v1/`: RESTful APIルート定義
  - バリデーション、シリアライゼーション
- **依存関係**: 他の層に依存しない（最も外側の層）
- **特徴**: 依存性注入コンテナ経由で他の層を利用

## 依存性注入パターン
```typescript
// Dependencies.ts でコンテナ定義
export class Dependencies {
  public readonly todoRepository: ITodoRepository
  public readonly createTodoUseCase: CreateTodoUseCase
  
  constructor(env: CloudflareEnv) {
    this.todoRepository = new D1TodoRepository(env.DB)
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
  }
}
```

## ESLintによる依存方向制御
- `eslint-plugin-boundaries`: 層間の依存関係を制御
- `import/no-restricted-paths`: 具体的なファイルパスレベルでの制御
- 違反時にビルドエラーで即座に検出

## 実装パターン
1. **新機能追加時**:
   - Domain → Application → Infrastructure → Presentation の順で実装
   - 各層で必要なインターフェースを先に定義
2. **テスト戦略**:
   - Domain/Application層: 単体テスト（純粋関数のテスト）
   - Infrastructure層: カバレッジ対象外（外部依存が多いため）
   - Presentation層: 統合テスト（Bruno API テスト）