# 型安全性戦略

## エンドツーエンド型安全性
1. **バックエンド型定義**
   - `back/src/presentation/app.ts`で`AppType`を定義・エクスポート
   - Honoルート定義から自動的に型が生成される

2. **型の共有**
   - `shared/client.ts`で`AppType`を`ClientType`として再エクスポート
   - バックエンドからフロントエンドへのブリッジ役割

3. **フロントエンド型付きクライアント**
   - `front/app/client.ts`で`hc<ClientType>()`を使用
   - 完全に型付けされたAPIクライアントを生成
   - ローダー/アクションで型安全なAPI呼び出し

## 型生成コマンド
- **バックエンド**: `pnpm cf-typegen` - Cloudflare環境型生成
- **フロントエンド**: `pnpm cf-typegen && react-router typegen` - CF型＋RR型生成

## 型チェック
- **ルートレベル**: `pnpm typecheck` - 両方の型チェック実行
- **個別**: `pnpm back typecheck` / `pnpm front typecheck`

この仕組みにより、APIの変更が即座にフロントエンドの型エラーとして検出される