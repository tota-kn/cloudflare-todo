import { expect, Page } from '@playwright/test';
import { TodoItemSelectors } from './todo-item-selectors';

/**
 * Todoアプリケーションの高レベル操作を提供するヘルパークラス
 */
export class TodoHelpers {
  private selectors: TodoItemSelectors;

  constructor(private page: Page) {
    this.selectors = new TodoItemSelectors(page);
  }

  async Todoを作成(title: string, description: string) {
    await this.page.getByRole('button', { name: /add todo|add|create|\+/i }).click();
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).toBeVisible();
    const descriptionInput = this.page.getByPlaceholder(/description|todo.*description/i).or(
      this.page.getByRole('textbox', { name: /description/i })
    );
    
    await titleInput.fill(title);
    await descriptionInput.fill(description);
    await this.page.getByRole('button', { name: /save|submit|create/i }).click();
    await expect(this.page.getByText(title)).toBeVisible();
    await expect(this.page.getByText(description)).toBeVisible();
  }

  async Todoタイトルを編集(currentTitle: string, newTitle: string) {
    const titleElement = this.selectors.Todoタイトルを取得(currentTitle);
    await titleElement.click();
    const editInput = this.selectors.タイトル編集入力フィールドを取得(currentTitle);
    await editInput.fill(newTitle);
    await this.page.keyboard.press('Enter');
    await expect(this.page.getByText(newTitle)).toBeVisible();
  }

  async Todo説明を編集(todoTitle: string, newDescription: string) {
    const descriptionElement = this.selectors.Todo説明を取得(todoTitle);
    await descriptionElement.click();
    const editTextarea = this.selectors.説明編集入力フィールドを取得(todoTitle);
    await editTextarea.fill(newDescription);
    await this.page.keyboard.press('Enter');
    await expect(this.page.getByText(newDescription)).toBeVisible();
  }

  async Todoを完了にする(title: string) {
    const completeButton = this.selectors.完了ボタンを取得(title);
    await completeButton.click();
    const completedSection = this.page.getByRole('heading', { name: /completed|done|finished/i });
    await expect(completedSection.locator('..').getByText(title)).toBeVisible();
  }

  async Todoを未完了にする(title: string) {
    const pendingButton = this.selectors.完了ボタンを取得(title);
    await pendingButton.click();
    const pendingSection = this.page.getByRole('heading', { name: /pending|incomplete/i });
    await expect(pendingSection.locator('..').getByText(title)).toBeVisible();
  }

  async Todoを削除(title: string) {
    const deleteButton = this.selectors.削除ボタンを取得(title);
    await deleteButton.click();
    this.page.on('dialog', dialog => dialog.accept());
    await this.selectors.Todoアイテムが表示されていないか確認(title);
  }

  async 作成フォームを表示() {
    await this.page.getByRole('button', { name: /add todo|add|create|\+/i }).click();
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).toBeVisible();
  }

  async 作成フォームをキャンセル() {
    await this.page.getByRole('button', { name: /cancel|close|×/i }).click();
    const titleInput = this.page.getByPlaceholder(/title|todo.*title/i).or(
      this.page.getByRole('textbox', { name: /title/i })
    );
    await expect(titleInput).not.toBeVisible();
  }

  async 全Todoを削除() {
    let deleteButtons = this.page.getByTitle('Delete');
    
    let count = await deleteButtons.count();
    while (count > 0) {
      await deleteButtons.first().click();
      this.page.on('dialog', dialog => dialog.accept());
      await this.page.waitForTimeout(100);
      count = await deleteButtons.count();
    }
  }

  async セクション内のTodoを確認(sectionTitle: string, todoTitle: string) {
    const section = this.page.getByRole('heading', { name: new RegExp(sectionTitle, 'i') });
    await expect(section.locator('..').getByText(todoTitle)).toBeVisible();
  }
}