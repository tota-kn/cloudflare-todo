import { test } from "@playwright/test";
import { TodoUIヘルパー } from "../helpers/ui-helpers";

test("新規作成でタイトルが空の間は保存ボタンが無効になる", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `バリデーションテスト Todo ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.新規Todoページへ移動();

  await ui.保存ボタン無効確認();

  await ui.Todoタイトル入力().fill(testTodoTitle);
  await ui.保存ボタン有効確認();

  await ui.Todoタイトル入力().clear();
  await ui.保存ボタン無効確認();
});

test("編集でタイトルを空にすると保存ボタンが無効になる", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `編集バリデーションテスト Todo ${uniqueSuffix}`;
  const testTodoDescription = `編集バリデーションテスト用の説明文です ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.Todo作成(testTodoTitle, testTodoDescription);
  await ui.Todo編集ページへ移動(testTodoTitle);

  await ui.保存ボタン有効確認();

  await ui.Todoタイトル入力().clear();
  await ui.保存ボタン無効確認();
});

test("新規作成をキャンセルするとTodoは保存されない", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `キャンセルテスト Todo ${uniqueSuffix}`;
  const testTodoDescription = `キャンセルテスト用の説明文です ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.新規Todoページへ移動();
  await ui.Todoフォーム入力(testTodoTitle, testTodoDescription);

  await ui.キャンセル();

  await ui.Todo非表示確認(testTodoTitle);
});
