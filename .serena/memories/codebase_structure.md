# コードベース構造

## ディレクトリ構成

```
cloudflare-todo/
├── back/                     # バックエンド（Cloudflare Workers）
│   ├── src/
│   │   ├── domain/          # ドメイン層
│   │   │   ├── entities/    # エンティティ
│   │   │   └── value-objects/ # 値オブジェクト
│   │   ├── application/     # アプリケーション層
│   │   │   ├── dto/         # データ転送オブジェクト
│   │   │   ├── repositories/ # リポジトリインターフェース
│   │   │   └── usecases/    # ユースケース
│   │   ├── infrastructure/  # インフラストラクチャ層
│   │   │   ├── database/    # データベーステーブル定義
│   │   │   └── repositories/ # リポジトリ実装
│   │   ├── presentation/    # プレゼンテーション層
│   │   │   └── api/v1/      # APIルート
│   │   ├── types/           # 型定義
│   │   ├── index.ts         # Workerエントリーポイント
│   │   └── Dependencies.ts  # 依存性注入コンテナ
│   ├── migrations/          # D1データベースマイグレーション
│   ├── test/               # テストファイル
│   │   ├── unit/           # 単体テスト
│   │   └── api/            # API統合テスト（Bruno）
│   └── buckets/            # R2バケット初期化スクリプト
├── front/                   # フロントエンド（Cloudflare Pages）
│   ├── app/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── contexts/       # Reactコンテキスト
│   │   ├── hooks/          # カスタムフック
│   │   ├── routes/         # ルートコンポーネント
│   │   ├── client.ts       # 型付きAPIクライアント
│   │   └── root.tsx        # ルートレイアウト
│   └── workers/            # Cloudflare Worker統合
├── shared/                  # 共有型定義
│   └── client.ts           # 型ブリッジ
├── e2e/                    # E2Eテスト
│   ├── tests/              # Playwrightテスト
│   └── helpers/            # テストヘルパー
└── pnpm-workspace.yaml     # pnpmワークスペース設定
```

## アーキテクチャ詳細

### バックエンド（オニオンアーキテクチャ）
1. **Domain層**: 純粋なビジネスロジック、他の層に依存しない
2. **Application層**: ユースケース実装、ドメイン層のみ依存
3. **Infrastructure層**: 外部システム（DB、ストレージ）との接続
4. **Presentation層**: HTTPリクエスト/レスポンス処理

### フロントエンド（React Router v7）
- ファイルベースルーティング
- SSR対応
- TanStack Queryによる状態管理
- Hono RPCクライアントによる型安全なAPI呼び出し