#!/usr/bin/env bash
# PostToolUse hook。編集したファイルだけを整形・lint 修正・型チェックし、直せなかった問題を Claude に返す。
set -euo pipefail

file=$(jq -r '.tool_input.file_path // empty')
cd "$CLAUDE_PROJECT_DIR"
[[ $file == "$PWD"/* && -f $file ]] || exit 0

# front は back の dist/types を読むので、back を編集したら型ファイルだけ出し直す。
# typegen 全体にしないのは、wrangler types が数秒かかり、編集のたびに走らせるには重いため
if [[ $file == "$PWD"/workspaces/back/src/* ]]; then
  pnpm -s b typegen:dts >/dev/null 2>&1 || true
fi

# pnpm の script を通さないのは、`$ vp ...` のエコーが Claude に返す出力に混ざるため
out=$(node_modules/.bin/vp check --fix --quiet --no-error-on-unmatched-pattern "$file" 2>&1) && exit 0
echo "$out" >&2
exit 2
