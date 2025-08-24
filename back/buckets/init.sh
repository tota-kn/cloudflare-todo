#!/bin/bash
set -e

echo "✅ Start R2 bucket initialization..."

# todo-app-storage-local ディレクトリ内の全ファイルをアップロード
pnpm wrangler r2 object put todo-app-storage-local/logo.png --file ./buckets/todo-app-storage-local/logo.png --local

echo "✅ R2 bucket initialization completed!"