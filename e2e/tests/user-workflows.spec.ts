import { expect, test } from '@playwright/test';

test.describe('User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Todo一覧ページにアクセス
    await page.goto('/todos');
  });

  test('完全なTodoワークフロー: 作成→編集→完了→削除', async ({ page }) => {
    // 既存データの表示確認（9件のテストデータがあることを確認）
    await expect(page.locator('[data-testid="todo-item"], .border.rounded-lg').filter({ hasNotText: 'Todo title...' })).toHaveCount(9);

    // 新規Todo作成フロー
    // 1. +ボタンをクリックしてフォームを表示
    await page.getByRole('button', { name: /add todo/i }).click();
    await expect(page.locator('input[data-new-todo-title]')).toBeVisible();

    // 2. タイトルと説明を入力
    await page.locator('input[data-new-todo-title]').fill('E2E Test Todo');
    await page.locator('textarea[data-new-todo-description]').fill('Created by E2E test');

    // 3. 保存ボタンをクリック
    await page.getByRole('button', { name: /save/i }).click();

    // 4. 作成されたTodoが未完了セクションに表示されることを確認
    await expect(page.locator('text=E2E Test Todo')).toBeVisible();
    await expect(page.locator('text=Created by E2E test')).toBeVisible();

    // 5. 作成されたTodoのタイトルを編集
    await page.locator('text=E2E Test Todo').click();
    await page.locator('input[type="text"]').filter({ hasValue: 'E2E Test Todo' }).fill('Updated E2E Test Todo');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Updated E2E Test Todo')).toBeVisible();

    // 6. 説明を編集
    await page.locator('text=Created by E2E test').click();
    await page.locator('textarea').filter({ hasValue: 'Created by E2E test' }).fill('Updated by E2E test');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Updated by E2E test')).toBeVisible();

    // 7. 完了状態に変更
    await page.locator('text=Updated E2E Test Todo').locator('..').locator('button[title*="Complete"]').click();
    
    // 完了セクションに移動していることを確認
    await expect(page.locator('h2:has-text("Completed Tasks")').locator('..').locator('text=Updated E2E Test Todo')).toBeVisible();

    // 8. 削除
    await page.locator('text=Updated E2E Test Todo').locator('..').locator('button[title*="Delete"]').click();
    
    // 確認ダイアログで削除を承認
    page.on('dialog', dialog => dialog.accept());
    
    // Todoが削除されたことを確認
    await expect(page.locator('text=Updated E2E Test Todo')).not.toBeVisible();
  });

  test('既存テストデータの操作', async ({ page }) => {
    // test-put-update-001 のタイトル編集
    await page.locator('text=Original Todo for Update').click();
    await page.locator('input[type="text"]').filter({ hasValue: 'Original Todo for Update' }).fill('Updated Original Todo');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Updated Original Todo')).toBeVisible();

    // test-incomplete-001 を完了状態に変更
    await page.locator('text=Incomplete Test Todo').locator('..').locator('button[title*="Complete"]').click();
    
    // 完了セクションに移動していることを確認
    await expect(page.locator('h2:has-text("Completed Tasks")').locator('..').locator('text=Incomplete Test Todo')).toBeVisible();

    // test-delete-success-001 を削除
    await page.locator('text=Test Todo for DELETE Success').locator('..').locator('button[title*="Delete"]').click();
    
    // 確認ダイアログで削除を承認
    page.on('dialog', dialog => dialog.accept());
    
    // Todoが削除されたことを確認
    await expect(page.locator('text=Test Todo for DELETE Success')).not.toBeVisible();
  });

  test('複数Todoの管理ワークフロー', async ({ page }) => {
    // 複数の新規Todoを作成
    const todos = [
      { title: 'First E2E Todo', description: 'First todo description' },
      { title: 'Second E2E Todo', description: 'Second todo description' },
      { title: 'Third E2E Todo', description: 'Third todo description' }
    ];

    for (const todo of todos) {
      // 新規作成フォームを表示
      await page.getByRole('button', { name: /add todo/i }).click();
      
      // タイトルと説明を入力
      await page.locator('input[data-new-todo-title]').fill(todo.title);
      await page.locator('textarea[data-new-todo-description]').fill(todo.description);
      
      // 保存
      await page.getByRole('button', { name: /save/i }).click();
      
      // 作成されたことを確認
      await expect(page.locator(`text=${todo.title}`)).toBeVisible();
    }

    // 一部を完了状態に変更
    await page.locator('text=First E2E Todo').locator('..').locator('button[title*="Complete"]').click();
    await page.locator('text=Third E2E Todo').locator('..').locator('button[title*="Complete"]').click();

    // 未完了/完了の分類表示確認
    await expect(page.locator('h2:has-text("Pending Tasks")').locator('..').locator('text=Second E2E Todo')).toBeVisible();
    await expect(page.locator('h2:has-text("Completed Tasks")').locator('..').locator('text=First E2E Todo')).toBeVisible();
    await expect(page.locator('h2:has-text("Completed Tasks")').locator('..').locator('text=Third E2E Todo')).toBeVisible();

    // 作成したTodoを削除
    for (const todo of todos) {
      await page.locator(`text=${todo.title}`).locator('..').locator('button[title*="Delete"]').click();
      page.on('dialog', dialog => dialog.accept());
      await expect(page.locator(`text=${todo.title}`)).not.toBeVisible();
    }
  });

  test('UI操作とキーボードショートカット', async ({ page }) => {
    // 新規作成フォームの表示/非表示切り替え
    await page.getByRole('button', { name: /add todo/i }).click();
    await expect(page.locator('input[data-new-todo-title]')).toBeVisible();
    
    // キャンセルボタンで非表示
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.locator('input[data-new-todo-title]')).not.toBeVisible();

    // 再度表示してキーボードでの操作をテスト
    await page.getByRole('button', { name: /add todo/i }).click();
    
    // タイトル入力
    await page.locator('input[data-new-todo-title]').fill('Keyboard Test Todo');
    
    // Tabで説明フィールドに移動
    await page.keyboard.press('Tab');
    await page.locator('textarea[data-new-todo-description]').fill('Created with keyboard shortcuts');
    
    // Enterで保存
    await page.keyboard.press('Enter');
    
    // 作成されたことを確認
    await expect(page.locator('text=Keyboard Test Todo')).toBeVisible();
    
    // Escapeでキャンセルのテスト
    await page.getByRole('button', { name: /add todo/i }).click();
    await page.locator('input[data-new-todo-title]').fill('This will be cancelled');
    await page.keyboard.press('Escape');
    
    // フォームが閉じられ、Todoが作成されていないことを確認
    await expect(page.locator('input[data-new-todo-title]')).not.toBeVisible();
    await expect(page.locator('text=This will be cancelled')).not.toBeVisible();
    
    // 作成したテストTodoを削除
    await page.locator('text=Keyboard Test Todo').locator('..').locator('button[title*="Delete"]').click();
    page.on('dialog', dialog => dialog.accept());
    await expect(page.locator('text=Keyboard Test Todo')).not.toBeVisible();
  });

  test('空の状態からのワークフロー', async ({ page }) => {
    // 全てのTodoを削除して空の状態を作る
    const todoItems = page.locator('[data-testid="todo-item"], .border.rounded-lg').filter({ hasNotText: 'Todo title...' });
    const count = await todoItems.count();
    
    for (let i = 0; i < count; i++) {
      const firstTodo = todoItems.first();
      await firstTodo.locator('button[title*="Delete"]').click();
      page.on('dialog', dialog => dialog.accept());
    }
    
    // 空の状態メッセージが表示されることを確認
    await expect(page.locator('text=No todos found. Create your first todo!')).toBeVisible();
    
    // 最初のTodoを作成
    await page.getByRole('button', { name: /add todo/i }).click();
    await page.locator('input[data-new-todo-title]').fill('My First Todo');
    await page.locator('textarea[data-new-todo-description]').fill('Starting fresh');
    await page.getByRole('button', { name: /save/i }).click();
    
    // 空の状態メッセージが消え、Todoが表示されることを確認
    await expect(page.locator('text=No todos found. Create your first todo!')).not.toBeVisible();
    await expect(page.locator('text=My First Todo')).toBeVisible();
    await expect(page.locator('h2:has-text("Pending Tasks")')).toBeVisible();
  });
});