import { expect, Page, Locator } from '@playwright/test';

/**
 * Todoアイテムの各要素（タイトル、説明、ボタン）を選択するヘルパークラス
 */
export class TodoItemSelectors {
  constructor(private page: Page) {}

  タイトルでTodoアイテムを取得(title: string): Locator {
    return this.page
      .getByRole('heading', { level: 3 })
      .filter({ hasText: title })
      .locator('..')
      .filter({ hasText: title })
      .first();
  }

  Todoタイトルを取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.getByRole('heading', { level: 3 }).filter({ hasText: todoTitle });
  }

  Todo説明を取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.locator('p.cursor-pointer').first();
  }

  完了ボタンを取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.getByRole('button').filter({ 
      hasText: /Mark Complete|Mark Pending/
    }).or(
      todoItem.getByTitle(/Mark Complete|Mark Pending/)
    );
  }

  削除ボタンを取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.getByTitle('Delete').or(
      todoItem.getByRole('button').filter({ hasText: 'Delete' })
    );
  }

  タイトル編集入力フィールドを取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.locator('input[type="text"]').first();
  }

  説明編集入力フィールドを取得(todoTitle: string): Locator {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    return todoItem.locator('textarea').first();
  }

  async Todoが完了状態か確認(todoTitle: string): Promise<boolean> {
    const titleElement = this.Todoタイトルを取得(todoTitle);
    const className = await titleElement.getAttribute('class');
    return className?.includes('line-through') || false;
  }

  async タイトルが編集モードか確認(todoTitle: string): Promise<boolean> {
    const editInput = this.タイトル編集入力フィールドを取得(todoTitle);
    return await editInput.isVisible();
  }

  async 説明が編集モードか確認(todoTitle: string): Promise<boolean> {
    const editTextarea = this.説明編集入力フィールドを取得(todoTitle);
    return await editTextarea.isVisible();
  }

  async Todoアイテムが表示されているか確認(todoTitle: string): Promise<void> {
    const todoItem = this.タイトルでTodoアイテムを取得(todoTitle);
    await expect(todoItem).toBeVisible();
  }

  async Todoアイテムが表示されていないか確認(todoTitle: string): Promise<void> {
    const titleElement = this.page.getByText(todoTitle);
    await expect(titleElement).not.toBeVisible();
  }

  async 完了ボタンの状態を取得(todoTitle: string): Promise<'完了' | '未完了' | '不明'> {
    const completeButton = this.完了ボタンを取得(todoTitle);
    const title = await completeButton.getAttribute('title');
    if (title?.includes('Mark Complete')) {
      return '未完了';
    } else if (title?.includes('Mark Pending')) {
      return '完了';
    }
    return '不明';
  }

  async 説明テキストを取得(todoTitle: string): Promise<string> {
    const descriptionElement = this.Todo説明を取得(todoTitle);
    const text = await descriptionElement.textContent();
    if (text === 'Add description...') {
      return '';
    }
    return text || '';
  }
}