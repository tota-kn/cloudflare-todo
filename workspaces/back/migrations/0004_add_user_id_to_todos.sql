-- Migration number: 0004   2026-02-21T00:00:00.000Z
-- Add user_id column to todos table for per-user todo management

-- SQLiteではALTER TABLE ADD COLUMNでNOT NULL外部キー制約を追加できないため、テーブルを再作成する

-- 1. user_id付きの新テーブルを作成
CREATE TABLE todos_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 2. 古いテーブルを削除（既存データはuser_id不明のため移行しない）
DROP TABLE todos;

-- 3. 新しいテーブルをリネーム
ALTER TABLE todos_new RENAME TO todos;

-- 4. インデックスを再作成
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_user_completed ON todos(user_id, completed);
