-- Migration number: 0002 	 2026-02-21T00:00:00.000Z
-- Reset all data and seed test data

-- テスト用ユーザーを作成
INSERT OR IGNORE INTO user (id, name, email, email_verified, created_at, updated_at) VALUES
  ('test-user-001', 'Test User 1', 'testuser1@example.com', 1, unixepoch(), unixepoch()),
  ('test-user-002', 'Test User 2', 'testuser2@example.com', 1, unixepoch(), unixepoch());

-- テスト用セッションを作成（APIテスト用の固定トークン）
DELETE FROM session;
INSERT INTO session (id, expires_at, token, created_at, updated_at, user_id) VALUES
  ('test-session-001', strftime('%s', '2099-12-31'), 'test-session-token-001', unixepoch(), unixepoch(), 'test-user-001'),
  ('test-session-002', strftime('%s', '2099-12-31'), 'test-session-token-002', unixepoch(), unixepoch(), 'test-user-002');

-- 既存データを削除
DELETE FROM todos;

-- ユーザー1のテストデータ
INSERT INTO todos (id, user_id, title, description, completed, created_at, updated_at) VALUES
  -- GET詳細成功テスト用
  ('test-get-success-001', 'test-user-001', 'Test Todo for GET Success', 'Description for GET success test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- PUT更新成功テスト用
  ('test-put-success-001', 'test-user-001', 'Test Todo for PUT Success', 'Description for PUT success test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- DELETE削除成功テスト用
  ('test-delete-success-001', 'test-user-001', 'Test Todo for DELETE Success', 'Description for DELETE success test', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- LIST用複数データ（一覧取得テスト用）
  ('test-list-item-001', 'test-user-001', 'List Test Todo 1', 'First item for list test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  ('test-list-item-002', 'test-user-001', 'List Test Todo 2', 'Second item for list test', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
  ('test-list-item-003', 'test-user-001', 'List Test Todo 3', 'Third item for list test', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- PUT更新テスト用追加データ
  ('test-put-update-001', 'test-user-001', 'Original Todo for Update', 'Original description', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- 完了状態のテスト用データ
  ('test-completed-001', 'test-user-001', 'Completed Test Todo', 'This todo is completed', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),

  -- 未完了状態のテスト用データ
  ('test-incomplete-001', 'test-user-001', 'Incomplete Test Todo', 'This todo is not completed', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');

-- ユーザー2のテストデータ（ユーザー分離テスト用）
INSERT INTO todos (id, user_id, title, description, completed, created_at, updated_at) VALUES
  ('test-user2-item-001', 'test-user-002', 'User2 Todo 1', 'This belongs to user 2', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');
