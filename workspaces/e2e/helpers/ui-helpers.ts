import { Locator, Page, expect } from "@playwright/test";

/**
 * Todo画面のE2Eテスト操作を集約するヘルパークラス
 * ロケータメソッド（要素取得）とアクションメソッド（操作実行）に分離して提供する
 */
export class TodoUIヘルパー {
  constructor(private page: Page) {}

  /**
   * タイトル入力フィールドを取得する
   * @returns タイトル入力フィールドのロケータ
   */
  Todoタイトル入力(): Locator {
    return this.page.getByPlaceholder("Todo title...");
  }

  /**
   * 説明入力フィールドを取得する
   * @returns 説明入力フィールドのロケータ
   */
  Todo説明入力(): Locator {
    return this.page.getByPlaceholder("Add description...");
  }

  /**
   * 新規Todo追加ボタンを取得する
   * @returns 追加ボタンのロケータ
   */
  Todo追加ボタン(): Locator {
    return this.page.locator('button[title="Add Todo"]');
  }

  /**
   * 保存ボタンを取得する
   * @returns 保存ボタンのロケータ
   */
  保存ボタン(): Locator {
    return this.page.locator('button:has-text("Save")');
  }

  /**
   * キャンセルボタン（新規作成・編集ページのテキストボタン）を取得する
   * @returns キャンセルボタンのロケータ
   */
  キャンセルボタン(): Locator {
    return this.page.getByRole("button", { name: "Cancel", exact: true });
  }

  /**
   * タイトルに一致するTodoアイテム全体（カード要素）を取得する
   * 並列実行時の誤爆を防ぐため、アイテム内のボタン操作はこのロケータでスコープする
   * @param title 対象Todoのタイトル
   * @returns Todoアイテムのロケータ
   */
  Todoアイテム取得(title: string): Locator {
    return this.page.locator("div.cursor-pointer").filter({
      has: this.page.getByRole("heading", { level: 3, name: title }),
    });
  }

  /**
   * タイトルに一致するTodoの完了ボタン（Mark Complete）を取得する
   * @param title 対象Todoのタイトル
   * @returns 完了ボタンのロケータ
   */
  完了ボタン(title: string): Locator {
    return this.Todoアイテム取得(title).getByTitle("Mark Complete");
  }

  /**
   * タイトルに一致する完了済みTodoの未完了に戻すボタン（Mark Pending）を取得する
   * @param title 対象Todoのタイトル
   * @returns 未完了に戻すボタンのロケータ
   */
  未完了ボタン(title: string): Locator {
    return this.Todoアイテム取得(title).getByTitle("Mark Pending");
  }

  /**
   * タイトルに一致するTodoの削除ボタンを取得する
   * @param title 対象Todoのタイトル
   * @returns 削除ボタンのロケータ
   */
  削除ボタン(title: string): Locator {
    return this.Todoアイテム取得(title).getByTitle("Delete");
  }

  /**
   * タイトルに一致するTodoの見出し要素を取得する
   * @param title 対象Todoのタイトル
   * @returns Todoタイトル見出しのロケータ
   */
  タイトルでTodo取得(title: string): Locator {
    return this.page
      .getByRole("heading", { level: 3 })
      .filter({ hasText: title })
      .first();
  }

  /**
   * 説明テキストに一致する要素を取得する
   * @param description 対象Todoの説明
   * @returns 説明テキストのロケータ
   */
  Todo説明取得(description: string): Locator {
    return this.page.getByText(description).first();
  }

  /**
   * タイトルに一致する完了済み（取り消し線付き）Todoの見出しを取得する
   * @param title 対象Todoのタイトル
   * @returns 完了済みTodo見出しのロケータ
   */
  完了済みTodo取得(title: string): Locator {
    return this.page
      .getByRole("heading", { level: 3 })
      .filter({ hasText: title })
      .and(this.page.locator(".line-through"))
      .first();
  }

  /**
   * 完了タスクセクションの見出しを取得する
   * @returns Completed Tasksセクション見出しのロケータ
   */
  完了タスクセクション取得(): Locator {
    return this.page.getByText("Completed Tasks");
  }

  /**
   * 未完了タスクセクションの見出しを取得する
   * @returns Pending Tasksセクション見出しのロケータ
   */
  未完了タスクセクション取得(): Locator {
    return this.page.getByText("Pending Tasks");
  }

  /**
   * 指定したプレフィックスを持つTodo見出しを表示順に取得する
   * 並び順の検証に使用する
   * @param prefix タイトルのプレフィックス
   * @returns 一致する見出し群のロケータ
   */
  プレフィックスでTodo見出し取得(prefix: string): Locator {
    return this.page
      .getByRole("heading", { level: 3 })
      .filter({ hasText: prefix });
  }

  /**
   * Todo一覧ページへ移動する
   */
  async Todoページへ移動(): Promise<void> {
    await this.page.goto("/en/todos");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * 追加ボタンから新規Todo作成ページへ移動する
   */
  async 新規Todoページへ移動(): Promise<void> {
    await expect(this.Todo追加ボタン()).toBeVisible();
    await this.Todo追加ボタン().click();
    await expect(this.page).toHaveURL(/\/en\/todos\/new/);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * タイトルに一致するTodoをクリックして編集ページへ移動する
   * @param title 対象Todoのタイトル
   */
  async Todo編集ページへ移動(title: string): Promise<void> {
    await expect(this.タイトルでTodo取得(title)).toBeVisible();
    await this.タイトルでTodo取得(title).click();
    await expect(this.page).toHaveURL(/\/en\/todos\/[a-f0-9-]+/);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Todoフォームにタイトルと説明を入力する
   * @param title 入力するタイトル
   * @param description 入力する説明
   */
  async Todoフォーム入力(title: string, description: string): Promise<void> {
    await expect(this.Todoタイトル入力()).toBeVisible();
    await expect(this.Todo説明入力()).toBeVisible();
    await this.Todoタイトル入力().fill(title);
    await this.Todo説明入力().fill(description);
  }

  /**
   * Todoフォームをクリアしてからタイトルと説明を入力する
   * @param title 入力するタイトル
   * @param description 入力する説明
   */
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

  /**
   * 保存ボタンをクリックしてTodo一覧ページへ戻ることを確認する
   */
  async Todo保存(): Promise<void> {
    await expect(this.保存ボタン()).toBeVisible();
    await this.保存ボタン().click();
    await expect(this.page).toHaveURL("/en/todos");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * キャンセルボタンをクリックして保存せずにTodo一覧ページへ戻ることを確認する
   */
  async キャンセル(): Promise<void> {
    await expect(this.キャンセルボタン()).toBeVisible();
    await this.キャンセルボタン().click();
    await expect(this.page).toHaveURL("/en/todos");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Todo一覧ページから新規Todoを作成する（移動→入力→保存の複合操作）
   * @param title 作成するTodoのタイトル
   * @param description 作成するTodoの説明
   */
  async Todo作成(title: string, description: string): Promise<void> {
    await this.新規Todoページへ移動();
    await this.Todoフォーム入力(title, description);
    await this.Todo保存();
  }

  /**
   * タイトルと説明が一覧に表示されていることを確認する
   * @param title 確認するタイトル
   * @param description 確認する説明
   */
  async Todo表示確認(title: string, description: string): Promise<void> {
    await expect(this.タイトルでTodo取得(title)).toBeVisible();
    await expect(this.Todo説明取得(description)).toBeVisible();
  }

  /**
   * タイトルに一致するTodoが一覧に存在しないことを確認する
   * @param title 確認するタイトル
   */
  async Todo非表示確認(title: string): Promise<void> {
    await expect(this.Todoアイテム取得(title)).toHaveCount(0);
  }

  /**
   * Todoが完了タスクセクションに取り消し線付きで表示されていることを確認する
   * @param title 確認するタイトル
   */
  async 完了Todo表示確認(title: string): Promise<void> {
    await expect(this.完了タスクセクション取得()).toBeVisible();
    await expect(this.完了済みTodo取得(title)).toBeVisible();
  }

  /**
   * Todoが未完了タスクセクションに取り消し線なしで表示されていることを確認する
   * @param title 確認するタイトル
   */
  async 未完了Todo表示確認(title: string): Promise<void> {
    await expect(this.未完了タスクセクション取得()).toBeVisible();
    await expect(this.タイトルでTodo取得(title)).toBeVisible();
    await expect(this.タイトルでTodo取得(title)).not.toHaveClass(
      /line-through/,
    );
  }

  /**
   * タイトルに一致するTodoを完了にする
   * @param title 対象Todoのタイトル
   */
  async Todo完了(title: string): Promise<void> {
    await expect(this.完了ボタン(title)).toBeVisible();
    await this.完了ボタン(title).click();
  }

  /**
   * タイトルに一致する完了済みTodoを未完了に戻す
   * @param title 対象Todoのタイトル
   */
  async Todo未完了に戻す(title: string): Promise<void> {
    await expect(this.未完了ボタン(title)).toBeVisible();
    await this.未完了ボタン(title).click();
  }

  /**
   * 確認ダイアログを承認してTodoを削除し、一覧から消えることを確認する
   * @param title 対象Todoのタイトル
   */
  async Todo削除(title: string): Promise<void> {
    this.page.once("dialog", (dialog) => void dialog.accept());
    await expect(this.削除ボタン(title)).toBeVisible();
    await this.削除ボタン(title).click();
    await this.Todo非表示確認(title);
  }

  /**
   * 確認ダイアログをキャンセルしてTodoが削除されず残ることを確認する
   * @param title 対象Todoのタイトル
   */
  async Todo削除キャンセル(title: string): Promise<void> {
    this.page.once("dialog", (dialog) => void dialog.dismiss());
    await expect(this.削除ボタン(title)).toBeVisible();
    await this.削除ボタン(title).click();
    await expect(this.Todoアイテム取得(title)).toBeVisible();
  }

  /**
   * 保存ボタンが無効化されていることを確認する
   */
  async 保存ボタン無効確認(): Promise<void> {
    await expect(this.保存ボタン()).toBeDisabled();
  }

  /**
   * 保存ボタンが有効であることを確認する
   */
  async 保存ボタン有効確認(): Promise<void> {
    await expect(this.保存ボタン()).toBeEnabled();
  }
}
