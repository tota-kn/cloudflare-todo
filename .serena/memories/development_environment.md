# 開発環境設定

## ランタイム環境

### Node.js
- **バージョン**: v22.14.0（mise.tomlで指定）
- **パッケージマネージャー**: pnpm
- **ワークスペース**: pnpm ワークスペース機能を使用

### パッケージ管理設定

#### ルートレベル (package.json)
```json
{
  "name": "cloudflare-todo",
  "version": "1.0.0",
  "workspaces": ["front", "back", "e2e"],
  "scripts": {
    "b": "pnpm --filter \"back\" run",
    "f": "pnpm --filter \"front\" run", 
    "e2e": "pnpm --filter \"e2e\" run",
    "typecheck": "pnpm b typecheck && pnpm f typecheck",
    "test:unit": "pnpm -r test:unit",
    "test:api": "pnpm b test:api",
    "test:e2e": "pnpm b db:reset && pnpm e2e test",
    "check-all": "pnpm -r lint && pnpm run typecheck && pnpm test:unit && pnpm test:api && pnpm test:e2e"
  }
}
```

#### ワークスペース設定 (pnpm-workspace.yaml)
```yaml
packages:
  - "workspaces/back"
  - "workspaces/front"
  - "workspaces/e2e"
```

## 開発ツール設定

### TypeScript設定

#### バックエンド (workspaces/back/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext", 
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ESNext"],
    "types": ["@cloudflare/workers-types/2023-07-01"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

#### フロントエンド (workspaces/front/tsconfig.json)
- プロジェクトリファレンス使用
- `tsconfig.node.json`, `tsconfig.cloudflare.json` で環境分離
- 厳密な型チェック有効

### コードフォーマット・品質

#### Prettier設定 (.prettierrc)
```json
{
  "semi": false,
  "singleQuote": false, 
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false
}
```

#### ESLint設定
- バックエンド・フロントエンドで共通のESLint設定
- TypeScript推奨ルール適用
- インポートルール、コード品質ルール

### テスト環境

#### 単体テスト
- **フレームワーク**: Vitest
- **対象**: バックエンド・フロントエンド両方
- **カバレッジ**: 自動生成

#### 統合テスト
- **API テスト**: Bruno
- **E2E テスト**: Playwright

## Cloudflare 開発環境

### Workers 設定 (wrangler.jsonc)
```jsonc
{
  "name": "todo-back-local",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-15",
  "node_compat": true
}
```

### 環境別設定
- **local**: localhost開発環境
- **dev**: 開発デプロイ環境
- **prd**: 本番環境

### データベース・ストレージ
- **D1**: SQLデータベース、マイグレーション管理
- **R2**: オブジェクトストレージ、ファイルアップロード

## 開発ワークフロー

### 推奨開発手順
1. `pnpm install` - 依存関係インストール
2. `pnpm b dev` & `pnpm f dev` - 両サーバー起動
3. 開発・変更作業
4. `pnpm typecheck` - 型チェック
5. `pnpm -r lint` - リント実行
6. `pnpm test:unit` - 単体テスト
7. `pnpm test:api` - APIテスト
8. `pnpm test:e2e` - E2Eテスト

### 便利コマンド
```bash
# ワークスペース横断作業
pnpm -r [command]        # 全ワークスペースで実行
pnpm check-all           # 全品質チェック実行

# 個別ワークスペース作業  
pnpm b [command]         # バックエンドコマンド
pnpm f [command]         # フロントエンドコマンド
pnpm e2e [command]       # E2Eテストコマンド
```

## IDE・エディタ設定

### VS Code設定 (.vscode/)
- TypeScript設定
- ESLint・Prettier統合
- デバッグ設定

### 開発コンテナ (.devcontainer/)
- 統一開発環境提供
- 必要ツールプリインストール

## 品質保証体制

### 自動化されたチェック
1. **型安全性**: TypeScript strict mode
2. **コード品質**: ESLint + Prettier
3. **テスト**: 単体・統合・E2E の3層テスト
4. **CI/CD**: GitHub Actions での自動チェック

### 手動チェックポイント
- コードレビュー時の設計確認
- パフォーマンス確認
- セキュリティ確認