# React Router v7 SSR + react-i18next 多言語対応実装進捗

## 実装概要

- **対象言語**: 英語（デフォルト）・日本語
- **URLパターン**: `/:lang/path` (例: `/en/todos`, `/ja/todos`)
- **翻訳キー**: 英語原文ベース
- **アプローチ**: 段階的実装・最低限動作確認後に全体適用

## 進捗状況

### Phase 0: 準備・計画

- [x] 作業進捗ファイル作成
- [ ] 依存関係追加
- [ ] Context7による技術調査
- [ ] 基本i18n設定ファイル作成

### Phase 1: 最小構成での動作確認 ✅

- [x] 基本的なi18next設定
- [x] PageHeaderコンポーネントの多言語化
- [x] 言語切り替えボタンの追加
- [x] 最低限の動作確認（言語切り替え・SSR）
- [x] i18n初期化エラーの修正

### Phase 2: ルート構造変更 ✅

- [x] `($lang)` パラメータ付きルート構造への移行
- [x] 言語検出・リダイレクト処理
- [x] サーバーサイド言語初期化

### Phase 3: 全コンポーネント多言語化 ✅

- [x] 全翻訳ファイルの作成
- [x] 全コンポーネントのi18n適用
- [x] クライアントサイド言語切り替え

### Phase 4: SEO対応・最終調整 ✅

- [x] `<html lang>` 動的設定
- [x] alternate link tags
- [x] メタ情報多言語化
- [x] 最終品質チェック

## 技術メモ

### 依存関係

```bash
pnpm add react-i18next i18next i18next-resources-to-backend
```

### 予定ファイル構造

```
app/
├── locales/
│   ├── en/common.json
│   └── ja/common.json
├── i18n/
│   ├── config.ts
│   ├── server.ts
│   └── client.ts
└── routes/
    └── ($lang)/
        ├── index.tsx
        └── todos/
            ├── index.tsx
            ├── new.tsx
            └── $id.tsx
```

### Context7調査結果（react-i18next SSR）

- **SSRでの主要パターン**: `window.__PRELOADED_STATE__`でサーバーからクライアントへデータ受け渡し
- **初期化方法**: サーバーサイドでi18nextを初期化し、翻訳リソースを事前ロード
- **ハイドレーション**: クライアントサイドで同じ状態でi18nextを再初期化
- **言語検出**: URLパラメータ（`?lng=en`）やサーバーリクエストから言語を検出
- **重要**: SSR環境では各リクエストで独立したi18nextインスタンスが必要

### 実装方針

1. **段階的アプローチ**: 最小構成で動作確認後、全体適用
2. **React Router v7対応**: loaderでの言語検出とコンテキスト渡し
3. **リソース管理**: `i18next-resources-to-backend`で動的ロード

## 発生した問題と解決方法

### 問題1: [記録予定]

**問題**:
**解決方法**:
**参照**:

## 次のステップ

1. 基本i18n設定ファイル作成
2. 翻訳リソースファイル作成

## 完了した作業

### Phase 0 & 1

- 作業進捗ファイル作成
- 依存関係追加 (react-i18next, i18next, i18next-resources-to-backend)
- Context7でSSR実装方法調査
- 基本i18n設定ファイル作成 (config.ts, server.ts, client.ts)
- PageHeaderコンポーネント多言語化
- 言語切り替えボタン実装
- 翻訳リソースファイル作成 (en/common.json, ja/common.json)
- i18n初期化エラー修正

### Phase 2

- URLパラメータベースの言語ルーティング実装
- 新しいルートファイル作成:
  - `routes/$lang/index.tsx` - ルート言語リダイレクト
  - `routes/$lang/todos/index.tsx` - 言語対応Todoリスト
  - `routes/$lang/todos/new.tsx` - 言語対応Todo作成
  - `routes/$lang/todos/$id.tsx` - 言語対応Todo編集
- PageHeaderコンポーネントに言語対応ナビゲーション追加
- 言語バリデーション・リダイレクト処理実装
- 型チェック完了・動作確認OK

### Phase 3

- 全コンポーネントの多言語化完了:
  - `TodoInput` - プレースホルダーテキストの翻訳
  - `TodoEditor` - タイムスタンプ表示の翻訳
  - `TodoItem` - 確認ダイアログ、ツールチップ、タイムスタンプの翻訳
  - ルートファイル - ボタンテキストの翻訳
- 言語対応ナビゲーション実装（TodoItem内の編集リンク）
- 翻訳リソースファイルの拡充

### Phase 4 - SEO最適化

- `root.tsx`に動的`html lang`属性設定実装
- 各ルートでのmeta情報多言語化（title, description, og:tags）
- alternate link tags実装（静的ルートはlinks関数、動的ルートはmeta関数）
- 型安全性の確保と最終品質チェック完了

---

**最終更新**: 2025-08-25
**実装者**: Claude Code
