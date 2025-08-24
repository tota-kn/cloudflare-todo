TODO
- [ ] E2Eテスト
- [ ] DevContainer
- [ ] front多言語化
- [ ] E2Eフォルダ　eslint, tsc
- [ ] ログイン機能

---

## 共通
- [x] E2Eテスト
- [ ] OAuth認証
- [ ] CLAUDE.md
  - [ ] TSDoc記載
  - [ ] hooks
  - [ ] task
  - [x] context7
- [ ] 型チェック、リント、フォーマット、テストの実行まで完了してからビルド、デプロイ

## back
- [x] リンター
- [x] フォーマッター
- [x] ユニットテスト
- [x] APIテスト
- [x] ORM Drizzel
- [x] クリーンアーキテクチャのレイヤー分け

## front
- [x] リンター
- [x] フォーマッター
- [ ] ユニットテスト
- [x] tailwind
- [x] ライトモード、ダークモード
- [ ] PWA化
- [ ] Cookie
- [ ] 多言語

--- 
# 環境構築
1. pnpm install
2. pnpx playwright install
3. Run Task: all
4. pnpm b test:api
5. pnpm test:e2e