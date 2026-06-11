import { test } from "@playwright/test";
import { TodoUIヘルパー } from "../helpers/ui-helpers";

test("Todoを完了にした後、未完了に戻せる", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `完了切替テスト Todo ${uniqueSuffix}`;
  const testTodoDescription = `完了切替テスト用の説明文です ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.Todo作成(testTodoTitle, testTodoDescription);
  await ui.Todo表示確認(testTodoTitle, testTodoDescription);

  await ui.Todo完了(testTodoTitle);
  await ui.完了Todo表示確認(testTodoTitle);

  await ui.Todo未完了に戻す(testTodoTitle);
  await ui.未完了Todo表示確認(testTodoTitle);
});
