-- Migration number: 0002 	 2025-01-16T00:00:00.000Z
-- Reset all data and seed test data for parallel independent API tests

-- 既存の全データを削除
DELETE FROM todos;

-- テスト用固定データを投入（並列独立テスト用）
INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES
  -- GET詳細成功テスト用
  ('test-get-success-001', 'Test Todo for GET Success', 'Description for GET success test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- PUT更新成功テスト用
  ('test-put-success-001', 'Test Todo for PUT Success', 'Description for PUT success test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- DELETE削除成功テスト用
  ('test-delete-success-001', 'Test Todo for DELETE Success', 'Description for DELETE success test', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- LIST用複数データ（一覧取得テスト用）
  ('test-list-item-001', 'List Test Todo 1', 'First item for list test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  ('test-list-item-002', 'List Test Todo 2', 'Second item for list test', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  ('test-list-item-003', 'List Test Todo 3', 'Third item for list test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- PUT更新テスト用追加データ
  ('test-put-update-001', 'Original Todo for Update', 'Original description', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- 完了状態のテスト用データ
  ('test-completed-001', 'Completed Test Todo', 'This todo is completed', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  
  -- 未完了状態のテスト用データ
  ('test-incomplete-001', 'Incomplete Test Todo', 'This todo is not completed', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');