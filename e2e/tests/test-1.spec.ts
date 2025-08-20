import { test } from '@playwright/test';
import { TodoItemSelectors } from '../helpers/todo-item-selectors';


test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const selector = new TodoItemSelectors(page);

  // 一番上のTodoアイテムを完了
  // await page.getByRole('button', { name: 'Mark Complete' }).first().click();

  // タイトルを編集
  const title = "List Test Todo 1"
  await page.getByText(title).first().click()
  await page.getByRole('textbox', { name: 'Todo title...' }).first().fill('aaa');
});

