import { Locator, Page, expect } from "@playwright/test";

export class TodoUIヘルパー {
  constructor(private page: Page) {}

  Todoタイトル入力(): Locator {
    return this.page.getByPlaceholder("Todo title...");
  }

  Todo説明入力(): Locator {
    return this.page.getByPlaceholder("Add description...");
  }

  Todo追加ボタン(): Locator {
    return this.page.locator('button[title="Add Todo"]');
  }

  保存ボタン(): Locator {
    return this.page.locator('button:has-text("Save")');
  }

  完了ボタン(): Locator {
    return this.page.getByTitle("Mark Complete").first();
  }

  タイトルでTodo取得(title: string): Locator {
    return this.page
      .getByRole("heading", { level: 3 })
      .filter({ hasText: title })
      .first();
  }

  Todo説明取得(description: string): Locator {
    return this.page.getByText(description).first();
  }

  完了済みTodo取得(title: string): Locator {
    return this.page
      .getByRole("heading", { level: 3 })
      .filter({ hasText: title })
      .and(this.page.locator(".line-through"))
      .first();
  }

  完了タスクセクション取得(): Locator {
    return this.page.getByText("Completed Tasks");
  }

  async Todoページへ移動(): Promise<void> {
    await this.page.goto("/todos");
    await this.page.waitForLoadState("networkidle");
  }

  async 新規Todoページへ移動(): Promise<void> {
    await expect(this.Todo追加ボタン()).toBeVisible();
    await this.Todo追加ボタン().click();
    await expect(this.page).toHaveURL(/\/todos\/new/);
    await this.page.waitForLoadState("networkidle");
  }

  async Todo編集ページへ移動(title: string): Promise<void> {
    await expect(this.タイトルでTodo取得(title)).toBeVisible();
    await this.タイトルでTodo取得(title).click();
    await expect(this.page).toHaveURL(/\/todos\/[a-f0-9-]+/);
    await this.page.waitForLoadState("networkidle");
  }

  async Todoフォーム入力(title: string, description: string): Promise<void> {
    await expect(this.Todoタイトル入力()).toBeVisible();
    await expect(this.Todo説明入力()).toBeVisible();
    await this.Todoタイトル入力().fill(title);
    await this.Todo説明入力().fill(description);
  }

  async Todoフォームクリア入力(
    title: string,
    description: string,
  ): Promise<void> {
    await expect(this.Todoタイトル入力()).toBeVisible();
    await expect(this.Todo説明入力()).toBeVisible();
    await this.Todoタイトル入力().clear();
    await this.Todoタイトル入力().fill(title);
    await this.Todo説明入力().clear();
    await this.Todo説明入力().fill(description);
  }

  async Todo保存(): Promise<void> {
    await expect(this.保存ボタン()).toBeVisible();
    await this.保存ボタン().click();
    await expect(this.page).toHaveURL("/todos");
    await this.page.waitForLoadState("networkidle");
  }

  async Todo表示確認(title: string, description: string): Promise<void> {
    await expect(this.タイトルでTodo取得(title)).toBeVisible();
    await expect(this.Todo説明取得(description)).toBeVisible();
  }

  async 完了Todo表示確認(title: string): Promise<void> {
    await expect(this.完了タスクセクション取得()).toBeVisible();
    await expect(this.完了済みTodo取得(title)).toBeVisible();
  }

  async Todo完了(): Promise<void> {
    await expect(this.完了ボタン()).toBeVisible();
    await this.完了ボタン().click();
  }
}
