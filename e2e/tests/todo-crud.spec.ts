import { test, expect } from '@playwright/test';

test('Todo CRUD操作の完全なテストフロー', async ({ page }) => {
  await page.goto('/todos');
  
  // ページが読み込まれるまで待機
  await page.waitForLoadState('networkidle');
  
  const testTodoTitle = 'テスト Todo アイテム';
  const testTodoDescription = 'テスト用の説明文です';
  const editedTitle = '編集されたテスト Todo アイテム';
  const editedDescription = '編集された説明文です';

  // 1. 新しいTodoを作成（新規作成ページに移動）
  await page.click('button[title="Add Todo"]');
  
  // 新規作成ページでTodoを作成
  await expect(page).toHaveURL(/\/todos\/new/);
  await page.getByPlaceholder('Todo title...').fill(testTodoTitle);
  await page.getByPlaceholder('Add description...').fill(testTodoDescription);
  await page.click('button:has-text("Save")');
  
  // リストページに戻ることを確認
  await expect(page).toHaveURL('/todos');
  
  // 作成後に少し待機
  await page.waitForTimeout(1000);
  
  // 2. リストに新しいTodoが追加されていることを確認
  await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: testTodoTitle }).first()).toBeVisible();
  
  // 説明が正しく表示されていることを確認
  await expect(page.getByText(testTodoDescription).first()).toBeVisible();
  
  // 3. 編集画面に遷移することを確認
  await page.getByRole('heading', { level: 3 }).filter({ hasText: testTodoTitle }).first().click();
  await expect(page).toHaveURL(/\/todos\/[a-f0-9-]+/);
  
  // 4. タイトルと説明を編集
  await page.getByPlaceholder('Todo title...').clear();
  await page.getByPlaceholder('Todo title...').fill(editedTitle);
  await page.getByPlaceholder('Add description...').clear();
  await page.getByPlaceholder('Add description...').fill(editedDescription);
  
  // Saveボタンをクリックしてリストに戻る
  await page.click('button:has-text("Save")');
  
  // 5. リストに戻り、編集内容が反映されていることを確認
  await expect(page).toHaveURL('/todos');
  await page.waitForTimeout(1000);
  
  // 編集されたタイトルが表示されていることを確認
  await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: editedTitle }).first()).toBeVisible();
  
  // 編集された説明が表示されていることを確認
  await expect(page.getByText(editedDescription).first()).toBeVisible();
  
  // 6. 完了ボタンをクリックして、タスクが完了状態になることを確認
  await page.getByTitle('Mark Complete').first().click();
  
  // 少し待機してから確認
  await page.waitForTimeout(2000);
  
  // Completed Tasksセクションに移動したかどうか確認
  await expect(page.getByText('Completed Tasks')).toBeVisible();
  
  // 完了タスクセクションで編集済みタイトルを確認 - line-throughクラスを持つものを直接確認
  const completedTitle = page.getByRole('heading', { level: 3 }).filter({ hasText: editedTitle }).and(page.locator('.line-through'));
  await expect(completedTitle.first()).toBeVisible();
});