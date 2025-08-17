import { expect, test, Page } from '@playwright/test';

// ヘルパー関数群
class TodoHelpers {
  constructor(private page: Page) {}

  // Todo作成フロー
  async createTodo(title: string, description: string) {
    // "Add Todo"や"+"などのボタンを探してクリック
    await this.page.getByRole('button', { name: /add todo|add|create|\+/i }).click();
    
    // タイトル入力フィールドを探す（プレースホルダーやラベルから）
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).toBeVisible();
    
    // 説明入力フィールドを探す
    const descriptionInput = this.page.getByPlaceholder(/description|todo.*description/i).or(
      this.page.getByRole('textbox', { name: /description/i })
    );
    
    await titleInput.fill(title);
    await descriptionInput.fill(description);
    
    // 保存ボタンをクリック
    await this.page.getByRole('button', { name: /save|submit|create/i }).click();
    
    // 作成されたことを確認
    await expect(this.page.getByText(title)).toBeVisible();
    await expect(this.page.getByText(description)).toBeVisible();
  }

  // Todoタイトル編集
  async editTodoTitle(currentTitle: string, newTitle: string) {
    // 現在のタイトルをクリックして編集モードに
    await this.page.getByText(currentTitle).click();
    
    // 編集可能なタイトル入力フィールドを探して編集
    const editInput = this.page.locator('input[type="text"]').filter({ hasText: currentTitle }).or(
      this.page.getByRole('textbox')
    );
    await editInput.fill(newTitle);
    await this.page.keyboard.press('Enter');
    
    // 変更されたことを確認
    await expect(this.page.getByText(newTitle)).toBeVisible();
  }

  // Todo説明編集
  async editTodoDescription(currentDescription: string, newDescription: string) {
    // 現在の説明をクリックして編集モードに
    await this.page.getByText(currentDescription).click();
    
    // 編集可能な説明入力フィールドを探して編集
    const editTextarea = this.page.locator('textarea').filter({ hasText: currentDescription }).or(
      this.page.getByRole('textbox')
    );
    await editTextarea.fill(newDescription);
    await this.page.keyboard.press('Enter');
    
    // 変更されたことを確認
    await expect(this.page.getByText(newDescription)).toBeVisible();
  }

  // Todo完了状態に変更
  async completeTodo(title: string) {
    // Todoのタイトルを見つけてその親要素から完了ボタンを探す
    const todoCard = this.page.getByText(title).locator('..');
    const completeButton = todoCard.getByTitle('Mark Complete');
    
    await completeButton.click();
    
    // 完了セクションに移動していることを確認
    const completedSection = this.page.getByRole('heading', { name: /completed|done|finished/i });
    await expect(completedSection.locator('..').getByText(title)).toBeVisible();
  }

  // Todo未完了状態に変更
  async markTodoPending(title: string) {
    // Todoのタイトルを見つけてその親要素から未完了ボタンを探す
    const todoCard = this.page.getByText(title).locator('..');
    const pendingButton = todoCard.getByTitle('Mark Pending');
    
    await pendingButton.click();
    
    // 未完了セクションに移動していることを確認
    const pendingSection = this.page.getByRole('heading', { name: /pending|incomplete/i });
    await expect(pendingSection.locator('..').getByText(title)).toBeVisible();
  }

  // Todo削除
  async deleteTodo(title: string) {
    // Todoのタイトルを見つけてその親要素から削除ボタンを探す
    const todoCard = this.page.getByText(title).locator('..');
    const deleteButton = todoCard.getByTitle('Delete');
    
    await deleteButton.click();
    
    // 確認ダイアログで削除を承認
    this.page.on('dialog', dialog => dialog.accept());
    
    // Todoが削除されたことを確認
    await expect(this.page.getByText(title)).not.toBeVisible();
  }

  // 新規作成フォーム表示
  async showCreateForm() {
    await this.page.getByRole('button', { name: /add todo|add|create|\+/i }).click();
    
    // フォームが表示されたことを確認（タイトル入力フィールドの存在で判定）
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).toBeVisible();
  }

  // 新規作成フォームキャンセル
  async cancelCreateForm() {
    await this.page.getByRole('button', { name: /cancel|close|×/i }).click();
    
    // フォームが閉じられたことを確認
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).not.toBeVisible();
  }

  // 全Todoを削除（空の状態作成用）
  async deleteAllTodos() {
    // 削除ボタンがある限り削除を続ける
    let deleteButtons = this.page.getByTitle('Delete');
    
    let count = await deleteButtons.count();
    while (count > 0) {
      await deleteButtons.first().click();
      this.page.on('dialog', dialog => dialog.accept());
      
      // 少し待機してからカウントを再取得
      await this.page.waitForTimeout(100);
      count = await deleteButtons.count();
    }
  }

  // セクション内のTodo存在確認
  async expectTodoInSection(sectionTitle: string, todoTitle: string) {
    const section = this.page.getByRole('heading', { name: new RegExp(sectionTitle, 'i') });
    await expect(section.locator('..').getByText(todoTitle)).toBeVisible();
  }
}

test.describe('User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Todo一覧ページにアクセス
    await page.goto('/todos');
  });

  test('完全なTodoワークフロー: 作成→編集→完了→削除', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    // 既存データの表示確認（9件のテストデータがあることを確認）
    await expect(page.locator('[data-testid="todo-item"], .border.rounded-lg').filter({ hasNotText: 'Todo title...' })).toHaveCount(9);

    // 新規Todo作成フロー
    await helpers.createTodo('E2E Test Todo', 'Created by E2E test');

    // 作成されたTodoのタイトルを編集
    await helpers.editTodoTitle('E2E Test Todo', 'Updated E2E Test Todo');

    // 説明を編集
    await helpers.editTodoDescription('Created by E2E test', 'Updated by E2E test');

    // 完了状態に変更
    await helpers.completeTodo('Updated E2E Test Todo');

    // 削除
    await helpers.deleteTodo('Updated E2E Test Todo');
  });

  test('既存テストデータの操作', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    // test-put-update-001 のタイトル編集
    await helpers.editTodoTitle('Original Todo for Update', 'Updated Original Todo');

    // test-incomplete-001 を完了状態に変更
    await helpers.completeTodo('Incomplete Test Todo');

    // test-delete-success-001 を削除
    await helpers.deleteTodo('Test Todo for DELETE Success');
  });

  test('複数Todoの管理ワークフロー', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    // 複数の新規Todoを作成
    const todos = [
      { title: 'First E2E Todo', description: 'First todo description' },
      { title: 'Second E2E Todo', description: 'Second todo description' },
      { title: 'Third E2E Todo', description: 'Third todo description' }
    ];

    for (const todo of todos) {
      await helpers.createTodo(todo.title, todo.description);
    }

    // 一部を完了状態に変更
    await helpers.completeTodo('First E2E Todo');
    await helpers.completeTodo('Third E2E Todo');

    // 未完了/完了の分類表示確認
    await helpers.expectTodoInSection('Pending Tasks', 'Second E2E Todo');
    await helpers.expectTodoInSection('Completed Tasks', 'First E2E Todo');
    await helpers.expectTodoInSection('Completed Tasks', 'Third E2E Todo');

    // 作成したTodoを削除
    for (const todo of todos) {
      await helpers.deleteTodo(todo.title);
    }
  });

  test('UI操作とキーボードショートカット', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    // 新規作成フォームの表示/非表示切り替え
    await helpers.showCreateForm();
    
    // キャンセルボタンで非表示
    await helpers.cancelCreateForm();

    // 再度表示してキーボードでの操作をテスト
    await helpers.showCreateForm();
    
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
    await helpers.showCreateForm();
    await page.locator('input[data-new-todo-title]').fill('This will be cancelled');
    await page.keyboard.press('Escape');
    
    // フォームが閉じられ、Todoが作成されていないことを確認
    await expect(page.locator('input[data-new-todo-title]')).not.toBeVisible();
    await expect(page.locator('text=This will be cancelled')).not.toBeVisible();
    
    // 作成したテストTodoを削除
    await helpers.deleteTodo('Keyboard Test Todo');
  });

  test('空の状態からのワークフロー', async ({ page }) => {
    const helpers = new TodoHelpers(page);
    
    // 全てのTodoを削除して空の状態を作る
    await helpers.deleteAllTodos();
    
    // 空の状態メッセージが表示されることを確認
    await expect(page.locator('text=No todos found. Create your first todo!')).toBeVisible();
    
    // 最初のTodoを作成
    await helpers.createTodo('My First Todo', 'Starting fresh');
    
    // 空の状態メッセージが消え、Todoが表示されることを確認
    await expect(page.locator('text=No todos found. Create your first todo!')).not.toBeVisible();
    await expect(page.locator('h2:has-text("Pending Tasks")')).toBeVisible();
  });
});