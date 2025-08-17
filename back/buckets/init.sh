#!/bin/bash
set -e

echo "✅ Start R2 bucket initialization..."

# todo-app-storage-local ディレクトリ内の全ファイルをアップロード
echo "Uploading: test.png"
pnpm wrangler r2 object put todo-app-storage-local/test.png --file ./buckets/todo-app-storage-local/test.png --local

echo "✅ R2 bucket initialization completed!"