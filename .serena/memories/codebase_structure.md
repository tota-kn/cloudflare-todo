# コードベース構造

## ルートレベルファイル

### 設定ファイル
- `package.json`: モノレポのルート設定、ワークスペース間コマンド
- `pnpm-workspace.yaml`: pnpmワークスペース設定
- `mise.toml`: Node.js v22.14.0 指定
- `CLAUDE.md`: Claude Code用プロジェクト指針

### ディレクトリ構造
```
/workspace
├── workspaces/           # 全ワークスペース
│   ├── back/            # バックエンドワークスペース
│   ├── front/           # フロントエンドワークスペース  
│   └── e2e/             # E2Eテストワークスペース
├── .serena/             # Serena MCP設定
├── .github/             # GitHub Actions
├── .vscode/             # VS Code設定
└── .devcontainer/       # 開発コンテナ設定
```

## バックエンド構造 (workspaces/back/)

### オニオンアーキテクチャ実装

#### ドメイン層 (`src/domain/`)
```
domain/
├── entities/            # ビジネスエンティティ
│   └── Todo.ts         # Todoエンティティ
└── value-objects/       # 値オブジェクト
    ├── TodoId.ts       # Todo ID値オブジェクト
    └── TodoStatus.ts   # Todo状態値オブジェクト
```

#### アプリケーション層 (`src/application/`)
```
application/
├── dto/                 # データ転送オブジェクト
│   └── TodoDto.ts      # Todo DTO
├── repositories/        # リポジトリインターフェース
│   └── ITodoRepository.ts
└── usecases/           # ユースケース
    ├── CreateTodoUseCase.ts
    ├── GetTodoUseCase.ts
    ├── ListTodosUseCase.ts
    ├── UpdateTodoUseCase.ts
    └── DeleteTodoUseCase.ts
```

#### インフラストラクチャ層 (`src/infrastructure/`)
```
infrastructure/
├── database/           # データベース設定
│   ├── todoTable.ts   # Todoテーブル定義
│   └── todoAttachmentsTable.ts
└── repositories/       # リポジトリ実装
    └── D1TodoRepository.ts
```

#### プレゼンテーション層 (`src/presentation/`)
```
presentation/
├── app.ts              # Honoアプリ設定、AppType エクスポート
└── api/v1/             # API v1ルート
    ├── todos/          # Todo関連API
    │   ├── get.ts      # Todo一覧取得
    │   ├── post.ts     # Todo作成
    │   └── _todoId/    # Todo個別操作
    │       ├── get.ts  # Todo取得
    │       ├── put.ts  # Todo更新
    │       └── delete.ts # Todo削除
    └── assets/         # 静的ファイル配信
        └── _filename/
            └── get.ts
```

#### その他重要ファイル
- `src/Dependencies.ts`: 依存性注入コンテナ
- `src/index.ts`: Worker エントリーポイント
- `migrations/`: D1データベースマイグレーション

### テスト構造
```
test/
├── unit/               # 単体テスト
│   ├── application/    # アプリケーション層テスト
│   ├── domain/         # ドメイン層テスト
│   └── mocks/          # テストモック
└── api/                # Bruno APIテスト
    └── v1/             # API v1テスト
```

## フロントエンド構造 (workspaces/front/)

### React Router v7 構造

#### コアファイル
```
app/
├── root.tsx            # ルートレイアウト、エラーバウンダリー
├── client.ts           # 型付きAPIクライアント設定
├── entry.server.tsx    # サーバーエントリーポイント
└── routes.ts           # ルート設定
```

#### ルーティング (`app/routes/`)
```
routes/
├── index.tsx           # ホームページ
├── devtools.tsx        # 開発ツール
└── todos/              # Todo機能
    ├── index.tsx       # Todo一覧
    ├── new.tsx         # Todo作成
    └── $id.tsx         # Todo詳細
```

#### コンポーネント (`app/components/`)
```
components/
├── TodoList.tsx        # Todo一覧表示
├── TodoItem.tsx        # Todo項目
├── TodoInput.tsx       # Todo入力
├── TodoEditor.tsx      # Todo編集
├── LoadingSpinner.tsx  # ローディング表示
├── ErrorMessage.tsx    # エラー表示
├── PageHeader.tsx      # ページヘッダー
├── CircleButton.tsx    # 円形ボタン
└── CustomIcon.tsx      # カスタムアイコン
```

#### その他
```
app/
├── contexts/           # React Context
│   └── ThemeContext.tsx
├── hooks/              # カスタムフック
│   └── useTodos.ts
├── utils/              # ユーティリティ
│   ├── todoSort.ts
│   └── dateFormat.ts
└── types/              # 型定義
    └── shared.ts       # 共有型（ClientType等）
```

#### Workers統合
- `workers/app.ts`: Cloudflare Worker エントリーポイント

### テスト構造
```
test/
├── components/         # コンポーネントテスト
├── hooks/              # フックテスト
├── utils/              # ユーティリティテスト
└── setup.ts            # テスト設定
```

## E2Eテスト構造 (workspaces/e2e/)

```
e2e/
├── tests/              # テストファイル
│   └── todo-crud.spec.ts
├── helpers/            # テストヘルパー
│   └── ui-helpers.ts
└── playwright.config.ts # Playwright設定
```

## 型安全性の実現構造

### 型の流れ
1. `workspaces/back/src/presentation/app.ts` → `AppType` エクスポート
2. `workspaces/front/app/types/shared.ts` → `ClientType = AppType`
3. `workspaces/front/app/client.ts` → `hc<ClientType>()` でクライアント作成

これによりバックエンドAPIの変更が即座にフロントエンドの型に反映される。