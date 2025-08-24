-- Migration number: 0001 	 2025-07-07T00:00:00.000Z
-- Initial schema for Todo application

-- Drop existing table and recreate with UUID support
DROP TABLE IF EXISTS todos;

-- Recreate todos table with UUID primary key
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,  -- UUID as string
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,  -- SQLite boolean as integer
  created_at TEXT NOT NULL,  -- ISO string timestamp
  updated_at TEXT NOT NULL   -- ISO string timestamp
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);