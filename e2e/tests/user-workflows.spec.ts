import { expect, test } from '@playwright/test';
import { TodoHelpers } from '../helpers/todo-helpers';


test.describe('User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test('完全なTodoワークフロー: 作成→編集→完了→削除', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    await expect(page.locator('[data-testid="todo-item"], .border.rounded-lg').filter({ hasNotText: 'Todo title...' })).toHaveCount(9);

    await helpers.Todoを作成('E2E Test Todo', 'Created by E2E test');

    await helpers.Todoタイトルを編集('E2E Test Todo', 'Updated E2E Test Todo');

    await helpers.Todo説明を編集('Updated E2E Test Todo', 'Updated by E2E test');

    await helpers.Todoを完了にする('Updated E2E Test Todo');

    await helpers.Todoを削除('Updated E2E Test Todo');
  });

  test('既存テストデータの操作', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    await helpers.Todoタイトルを編集('Original Todo for Update', 'Updated Original Todo');

    await helpers.Todoを完了にする('Incomplete Test Todo');

    await helpers.Todoを削除('Test Todo for DELETE Success');
  });

  test('複数Todoの管理ワークフロー', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    const todos = [
      { title: 'First E2E Todo', description: 'First todo description' },
      { title: 'Second E2E Todo', description: 'Second todo description' },
      { title: 'Third E2E Todo', description: 'Third todo description' }
    ];

    for (const todo of todos) {
      await helpers.Todoを作成(todo.title, todo.description);
    }

    await helpers.Todoを完了にする('First E2E Todo');
    await helpers.Todoを完了にする('Third E2E Todo');

    await helpers.セクション内のTodoを確認('Pending Tasks', 'Second E2E Todo');
    await helpers.セクション内のTodoを確認('Completed Tasks', 'First E2E Todo');
    await helpers.セクション内のTodoを確認('Completed Tasks', 'Third E2E Todo');

    for (const todo of todos) {
      await helpers.Todoを削除(todo.title);
    }
  });

  test('UI操作とキーボードショートカット', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    await helpers.作成フォームを表示();
    
    await helpers.作成フォームをキャンセル();

    await helpers.作成フォームを表示();
    
    await page.locator('input[data-new-todo-title]').fill('Keyboard Test Todo');
    
    await page.keyboard.press('Tab');
    await page.locator('textarea[data-new-todo-description]').fill('Created with keyboard shortcuts');
    
    await page.keyboard.press('Enter');
    
    await expect(page.locator('text=Keyboard Test Todo')).toBeVisible();
    
    await helpers.作成フォームを表示();
    await page.locator('input[data-new-todo-title]').fill('This will be cancelled');
    await page.keyboard.press('Escape');
    
    await expect(page.locator('input[data-new-todo-title]')).not.toBeVisible();
    await expect(page.locator('text=This will be cancelled')).not.toBeVisible();
    
    await helpers.Todoを削除('Keyboard Test Todo');
  });

  test('空の状態からのワークフロー', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    await helpers.全Todoを削除();
    
    await expect(page.locator('text=No todos found. Create your first todo!')).toBeVisible();
    
    await helpers.Todoを作成('My First Todo', 'Starting fresh');
    
    await expect(page.locator('text=No todos found. Create your first todo!')).not.toBeVisible();
    await expect(page.locator('h2:has-text("Pending Tasks")')).toBeVisible();
  });
});