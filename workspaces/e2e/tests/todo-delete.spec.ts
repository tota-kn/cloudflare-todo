import { test } from "@playwright/test";
import { TodoUIヘルパー } from "../helpers/ui-helpers";

test("確認ダイアログを承認するとTodoが削除される", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `削除テスト Todo ${uniqueSuffix}`;
  const testTodoDescription = `削除テスト用の説明文です ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.Todo作成(testTodoTitle, testTodoDescription);
  await ui.Todo表示確認(testTodoTitle, testTodoDescription);

  await ui.Todo削除(testTodoTitle);
});

test("確認ダイアログをキャンセルするとTodoは削除されない", async ({ page }) => {
  const ui = new TodoUIヘルパー(page);

  const uniqueSuffix = Date.now();
  const testTodoTitle = `削除キャンセルテスト Todo ${uniqueSuffix}`;
  const testTodoDescription = `削除キャンセルテスト用の説明文です ${uniqueSuffix}`;

  await ui.Todoページへ移動();
  await ui.Todo作成(testTodoTitle, testTodoDescription);
  await ui.Todo表示確認(testTodoTitle, testTodoDescription);

  await ui.Todo削除キャンセル(testTodoTitle);

  await ui.Todo表示確認(testTodoTitle, testTodoDescription);
});
