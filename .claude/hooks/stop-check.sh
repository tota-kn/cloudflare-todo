#!/usr/bin/env bash
# Stop hook。編集ごとの検査では拾えない問題（ファイルをまたぐ型エラー、Bash での編集、単体テストの失敗）を終える前に返す。
set -euo pipefail

input=$(cat)
# 2 回目は通す。直せないまま止め続けないため
[[ $(jq -r '.stop_hook_active' <<<"$input") == true ]] && exit 0
cd "$CLAUDE_PROJECT_DIR"
[[ -n $(git status --porcelain) ]] || exit 0

block() {
  jq -nc --arg out "$(tail -n 60 <<<"$2")" '{decision: "block", reason: ($ARGS.positional[0] + "\n" + $out)}' --args "$1"
  exit 0
}

# 段階ごとに分けるのは、成功した段階の出力（wrangler のログなど）を Claude に返さないため
out=$(pnpm -s typegen 2>&1) || block "型生成（pnpm typegen）が失敗している。" "$out"
out=$(node_modules/.bin/vp check --quiet 2>&1) || block "vp check（整形・lint・型）が失敗している。pnpm fmt / pnpm lint で直せるものは直してから終えること。" "$out"
out=$(pnpm -s test:unit 2>&1) || block "単体テスト（pnpm test:unit）が失敗している。直してから終えること。" "$out"
