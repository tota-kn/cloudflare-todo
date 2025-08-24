import { test } from "@playwright/test";
import { TodoUIヘルパー } from "../helpers/ui-helpers";

test("Todo CRUD操作の完全なテストフロー", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const testTodoTitle = "テスト Todo アイテム";
  const testTodoDescription = "テスト用の説明文です";
  const editedTitle = "編集されたテスト Todo アイテム";
  const editedDescription = "編集された説明文です";

  await ui.Todoページへ移動();
  await ui.新規Todoページへ移動();

  await ui.Todoフォーム入力(testTodoTitle, testTodoDescription);
  await ui.Todo保存();

  await ui.Todo表示確認(testTodoTitle, testTodoDescription);

  await ui.Todo編集ページへ移動(testTodoTitle);

  await ui.Todoフォームクリア入力(editedTitle, editedDescription);

  await ui.Todo保存();

  await ui.Todo表示確認(editedTitle, editedDescription);

  await ui.Todo完了();

  await ui.完了Todo表示確認(editedTitle);
});
