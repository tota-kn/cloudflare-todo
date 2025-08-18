import { expect, Page, Locator } from '@playwright/test';

export class TodoFormSelectors {
  constructor(private page: Page) {}

  Todo作成ボタンを取得(): Locator {
    return this.page.getByRole('button', { name: /Add Todo|Cancel/i }).or(
      this.page.getByTitle(/Add Todo|Cancel/)
    );
  }

  新規作成フォームを取得(): Locator {
    return this.page.locator('.border-2.rounded-lg').filter({
      has: this.page.locator('input[data-new-todo-title]')
    });
  }

  新規作成タイトル入力フィールドを取得(): Locator {
    return this.page.locator('input[data-new-todo-title]');
  }

  新規作成説明入力フィールドを取得(): Locator {
    return this.page.locator('textarea[data-new-todo-description]');
  }

  保存ボタンを取得(): Locator {
    return this.page.getByTitle(/Save|Creating/).or(
      this.page.getByRole('button').filter({ 
        has: this.page.locator('svg path[d*="M5 13l4 4L19 7"]') 
      })
    );
  }

  キャンセルボタンを取得(): Locator {
    return this.page.getByTitle('Cancel').or(
      this.page.getByRole('button').filter({ 
        has: this.page.locator('svg path[d*="M6 18L18 6M6 6l12 12"]') 
      })
    );
  }

  async 新規作成フォームが表示されているか確認(): Promise<boolean> {
    const form = this.新規作成フォームを取得();
    return await form.isVisible();
  }

  async 新規作成フォームが表示されていないか確認(): Promise<void> {
    const form = this.新規作成フォームを取得();
    await expect(form).not.toBeVisible();
  }

  async タイトル入力フィールドにフォーカスがあるか確認(): Promise<boolean> {
    const titleInput = this.新規作成タイトル入力フィールドを取得();
    return await titleInput.evaluate(el => el === document.activeElement);
  }

  async 保存ボタンが有効か確認(): Promise<boolean> {
    const saveButton = this.保存ボタンを取得();
    const isDisabled = await saveButton.getAttribute('disabled');
    return isDisabled === null;
  }

  async 保存ボタンが無効か確認(): Promise<boolean> {
    const saveButton = this.保存ボタンを取得();
    const isDisabled = await saveButton.getAttribute('disabled');
    return isDisabled !== null;
  }
}