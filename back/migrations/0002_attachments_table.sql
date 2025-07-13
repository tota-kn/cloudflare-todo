-- Migration number: 0002 	 2025-07-07T00:00:00.001Z
-- Add todo_attachments table for file attachments

-- Create todo_attachments table
CREATE TABLE IF NOT EXISTS todo_attachments (
  id TEXT PRIMARY KEY,  -- UUID as string
  todo_id TEXT NOT NULL,  -- Foreign key to todos table
  file_key TEXT NOT NULL,  -- R2 file key
  original_filename TEXT NOT NULL,  -- Original filename from user
  file_size INTEGER NOT NULL,  -- File size in bytes
  content_type TEXT NOT NULL,  -- MIME type
  created_at TEXT NOT NULL,  -- ISO string timestamp
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_todo_attachments_todo_id ON todo_attachments(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_attachments_file_key ON todo_attachments(file_key);
CREATE INDEX IF NOT EXISTS idx_todo_attachments_created_at ON todo_attachments(created_at);