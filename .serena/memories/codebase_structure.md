# コードベース構造

## ディレクトリ構成
```
cloudflare-todo/
├── back/                          # バックエンド（Cloudflare Workers）
│   ├── src/
│   │   ├── domain/               # ドメイン層（エンティティ、値オブジェクト）
│   │   ├── application/          # アプリケーション層（ユースケース、DTO、インターフェース）
│   │   ├── infrastructure/       # インフラストラクチャ層（D1/R2実装）
│   │   ├── presentation/         # プレゼンテーション層（コントローラー、ルート）
│   │   ├── types/               # 型定義
│   │   ├── Dependencies.ts      # 依存性注入コンテナ
│   │   └── index.ts            # Workerエントリーポイント
│   ├── migrations/              # D1データベースマイグレーション
│   ├── test/api/               # Bruno APIテスト
│   ├── wrangler.jsonc          # Cloudflare Workers設定
│   └── package.json
├── front/                         # フロントエンド（Cloudflare Pages）
│   ├── app/
│   │   ├── routes/              # React Routerファイルベースルーティング
│   │   ├── components/          # Reactコンポーネント
│   │   ├── hooks/               # カスタムReactフック
│   │   ├── contexts/            # Reactコンテキスト
│   │   ├── client.ts           # 型付きAPIクライアント
│   │   └── root.tsx            # ルートレイアウト
│   ├── workers/                 # Cloudflare Workerエントリーポイント
│   ├── wrangler.jsonc          # Cloudflare Pages設定
│   └── package.json
├── shared/                        # 共有型定義
│   └── client.ts               # バックエンド型のフロントエンド向け再エクスポート
└── package.json                  # ワークスペース設定
```

## 重要なファイル
- `back/src/presentation/app.ts` - バックエンドルート定義とAppType型エクスポート
- `back/src/Dependencies.ts` - 依存性注入コンテナ
- `shared/client.ts` - 型共有ブリッジ
- `front/app/client.ts` - 型付きAPIクライアント設定
- `front/workers/app.ts` - Cloudflare Workerハンドラー