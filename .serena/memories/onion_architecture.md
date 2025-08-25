# オニオンアーキテクチャ実装詳細

## アーキテクチャ概要

バックエンド(`workspaces/back/`)は厳密なオニオンアーキテクチャを採用し、関心の分離と依存方向制御を実現している。

## 層構造と責務

### 1. ドメイン層 (`src/domain/`)
**最内層：ビジネスロジックの純粋な表現**

#### エンティティ (`entities/`)
- `Todo.ts`: Todoのビジネスルールとドメインロジック
  - 不変性の保証
  - ビジネスルール検証
  - ドメインイベント（将来拡張）

#### 値オブジェクト (`value-objects/`)
- `TodoId.ts`: ID の型安全性とバリデーション
- `TodoStatus.ts`: 状態遷移ルールの実装

**特徴**:
- 外部依存一切なし
- 純粋なTypeScriptオブジェクト
- ビジネスロジックのみに集中

### 2. アプリケーション層 (`src/application/`)
**ユースケース統率層**

#### ユースケース (`usecases/`)
```typescript
// 各ユースケースの責務
CreateTodoUseCase.ts    // Todo作成のビジネスフロー
GetTodoUseCase.ts       // Todo取得のビジネスフロー
ListTodosUseCase.ts     // Todo一覧のビジネスフロー
UpdateTodoUseCase.ts    // Todo更新のビジネスフロー
DeleteTodoUseCase.ts    // Todo削除のビジネスフロー
```

#### リポジトリインターフェース (`repositories/`)
- `ITodoRepository.ts`: ドメインが必要とするデータ操作の抽象化

#### DTO (`dto/`)
- `TodoDto.ts`: レイヤー間のデータ転送オブジェクト

**特徴**:
- ドメインオブジェクトを使用したビジネスフロー制御
- インフラストラクチャの抽象化（リポジトリパターン）
- トランザクション境界の管理

### 3. インフラストラクチャ層 (`src/infrastructure/`)
**外部システム接続層**

#### リポジトリ実装 (`repositories/`)
- `D1TodoRepository.ts`: Cloudflare D1での具体的なデータ操作実装

#### データベース設定 (`database/`)
- `todoTable.ts`: D1テーブル定義
- `todoAttachmentsTable.ts`: 添付ファイルテーブル定義

**特徴**:
- アプリケーション層のインターフェースを実装
- Cloudflare固有の実装詳細を隠蔽
- データベーススキーマとドメインモデルのマッピング

### 4. プレゼンテーション層 (`src/presentation/`)
**外部インターフェース層**

#### アプリケーション設定
- `app.ts`: Honoアプリ構成、ルート定義、AppType エクスポート

#### API実装 (`api/v1/`)
```
api/v1/
├── todos/
│   ├── get.ts      # GET /todos - リスト取得
│   ├── post.ts     # POST /todos - 作成
│   └── _todoId/
│       ├── get.ts    # GET /todos/:id - 個別取得
│       ├── put.ts    # PUT /todos/:id - 更新
│       └── delete.ts # DELETE /todos/:id - 削除
└── assets/
    └── _filename/
        └── get.ts  # 静的ファイル配信
```

**特徴**:
- HTTPリクエスト/レスポンスの処理
- バリデーション（`@hono/zod-validator`）
- 認証・認可（将来実装）
- エラーハンドリング

## 依存性の方向制御

### 依存方向ルール
```
Presentation → Application → Domain
     ↓              ↓
Infrastructure → Application
```

### ESLintによる強制
`eslint.config.mjs`で依存方向を自動チェック:

```javascript
{
  name: "import/no-restricted-paths",
  rule: {
    zones: [
      // ドメイン層：外部依存なし
      {
        target: "./src/domain",
        from: ["./src/application", "./src/infrastructure", "./src/presentation"]
      },
      // アプリケーション層：インフラストラクチャ層に依存しない
      {
        target: "./src/application", 
        from: ["./src/infrastructure", "./src/presentation"]
      }
    ]
  }
}
```

## 依存性注入

### DIコンテナ (`src/Dependencies.ts`)
```typescript
export class Dependencies {
  private static instance: Dependencies
  
  // リポジトリのファクトリメソッド
  createTodoRepository(env: Env): ITodoRepository {
    return new D1TodoRepository(env.TODO_DB)
  }
  
  // ユースケースのファクトリメソッド
  createListTodosUseCase(env: Env): ListTodosUseCase {
    return new ListTodosUseCase(this.createTodoRepository(env))
  }
}
```

### 注入パターン
1. **プレゼンテーション層**でDependenciesを取得
2. **Cloudflare環境変数**を注入
3. **ユースケース**を通じてビジネスロジック実行

## テスト戦略と層分離

### 単体テストでの層分離

#### ドメイン層テスト
```typescript
// test/unit/domain/entities/Todo.test.ts
// 純粋なビジネスロジックテスト、外部依存なし
```

#### アプリケーション層テスト
```typescript
// test/unit/application/usecases/*.test.ts  
// モックリポジトリでユースケースをテスト
```

#### インフラストラクチャ層テスト
```typescript
// 実際のD1データベースでリポジトリをテスト
```

### モック戦略 (`test/unit/mocks/`)
- `MockTodoRepository.ts`: リポジトリモック
- `TestFactory.ts`: テストデータファクトリ

## アーキテクチャの利点

### 1. 関心の分離
- 各層が単一責任
- 変更の影響範囲が明確
- テストが容易

### 2. 依存方向制御
- ドメインロジックが外部技術に依存しない
- インフラストラクチャの変更がビジネスロジックに影響しない
- 技術的選択の柔軟性

### 3. テスタビリティ
- モックによる単体テスト
- 各層の独立テスト
- 依存性注入による結合度低下

### 4. 保守性
- 新機能の追加が既存コードに影響しにくい
- リファクタリングの安全性
- コードの理解しやすさ

## 実装時の注意点

### 1. 依存方向の遵守
- ESLintルールを必ず設定
- コードレビューでチェック
- CIでの自動検証

### 2. インターフェース設計
- ドメインの観点からリポジトリインターフェースを設計
- 技術的制約をドメインに漏らさない
- 将来の拡張性を考慮

### 3. ユースケースの粒度
- 1ユースケース1責務
- 複雑なビジネスフローは複数ユースケースに分割
- トランザクション境界の明確化