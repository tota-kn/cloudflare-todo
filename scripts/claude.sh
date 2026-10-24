#!/usr/bin/env bash
# devcontainer の中で Claude Code を起動する。
#
# コンテナが無ければ作り、止まっていれば起動し、動いていればそのまま使う。
# 引数は claude にそのまま渡す（例: scripts/claude.sh --continue）。
#
# 使い方:
#   scripts/claude.sh [claude の引数...]
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v devcontainer >/dev/null; then
  echo "devcontainer CLI がありません: npm install -g @devcontainers/cli" >&2
  exit 1
fi

if ! out=$(devcontainer up --workspace-folder . 2>&1); then
  echo "$out" >&2
  exit 1
fi
exec devcontainer exec --workspace-folder . claude "$@"
