## 共通

- [x] CLAUDE.md
- [x] DevContainer
- [ ] ログイン機能 OAuth 認証

## back

- [x] リンター
- [x] フォーマッター
- [x] ユニットテスト
- [x] API テスト
- [x] ORM Drizzel
- [x] クリーンアーキテクチャのレイヤー分け

## front

- [x] リンター
- [x] フォーマッター
- [x] tailwind
- [x] ライトモード、ダークモード
- [x] ユニットテスト + Testing Library
- [ ] 多言語
  <!-- - [ ] PWA 化 -->
  <!-- - [ ] EU Cookie -->

## E2E

- [x] テスト作成
- [x] リンター
- [x] フォーマッター

---

# 環境構築

1. pnpm install
2. pnpx playwright install
3. Run Task: dev
4. pnpm all-check

## 環境変数の設定

`touch workspaces/back/.dev.vars`

```
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## TODO

- [ ] ログインユーザごとにタスクの出し分け
- [ ] ダークモードちらつきの解消
- [ ] 言語の自動検知
