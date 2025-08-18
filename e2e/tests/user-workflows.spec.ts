import { test, expect } from '@playwright/test';
import { TodoItemSelectors } from '../helpers/todo-item-selectors';

test.describe('User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test('Todoアイテムの作成', async ({ page }) => {
    const selectors = new TodoItemSelectors(page);
    
    // 新しいTodoを作成
    await page.getByPlaceholder('Add a new todo...').fill('テストTodo');
    await page.keyboard.press('Enter');
    
    // Todoが作成されたことを確認
    await selectors.Todoアイテムが表示されているか確認('テストTodo');
  });

  test('Todoアイテムの完了切り替え', async ({ page }) => {
    const selectors = new TodoItemSelectors(page);
    
    // 新しいTodoを作成
    await page.getByPlaceholder('Add a new todo...').fill('完了テスト');
    await page.keyboard.press('Enter');
    
    // 完了状態を確認（初期状態は未完了）
    const initialState = await selectors.完了ボタンの状態を取得('完了テスト');
    expect(initialState).toBe('未完了');
    
    // 完了ボタンをクリック
    await selectors.完了ボタンを取得('完了テスト').click();
    
    // 完了状態に変わったことを確認
    const completedState = await selectors.完了ボタンの状態を取得('完了テスト');
    expect(completedState).toBe('完了');
    
    // 再度クリックして未完了に戻す
    await selectors.完了ボタンを取得('完了テスト').click();
    
    const pendingState = await selectors.完了ボタンの状態を取得('完了テスト');
    expect(pendingState).toBe('未完了');
  });

  test('Todoアイテムの削除', async ({ page }) => {
    const selectors = new TodoItemSelectors(page);
    
    // 新しいTodoを作成
    await page.getByPlaceholder('Add a new todo...').fill('削除テスト');
    await page.keyboard.press('Enter');
    
    // 作成されたことを確認
    await selectors.Todoアイテムが表示されているか確認('削除テスト');
    
    // 削除ボタンをクリック
    await selectors.削除ボタンを取得('削除テスト').click();
    
    // 削除されたことを確認
    await selectors.Todoアイテムが表示されていないか確認('削除テスト');
  });

  test('Todoタイトルの編集', async ({ page }) => {
    const selectors = new TodoItemSelectors(page);
    
    // 新しいTodoを作成
    await page.getByPlaceholder('Add a new todo...').fill('編集前タイトル');
    await page.keyboard.press('Enter');
    
    // タイトルをクリックして編集モードにする
    await selectors.Todoタイトルを取得('編集前タイトル').click();
    
    // 編集モードになったことを確認
    const isEditMode = await selectors.タイトルが編集モードか確認('編集前タイトル');
    expect(isEditMode).toBe(true);
    
    // 新しいタイトルを入力
    const editInput = selectors.タイトル編集入力フィールドを取得('編集前タイトル');
    await editInput.clear();
    await editInput.fill('編集後タイトル');
    await editInput.press('Enter');
    
    // 編集後のタイトルが表示されることを確認
    await selectors.Todoアイテムが表示されているか確認('編集後タイトル');
    await selectors.Todoアイテムが表示されていないか確認('編集前タイトル');
  });

  test('Todo説明の編集', async ({ page }) => {
    const selectors = new TodoItemSelectors(page);
    
    // 新しいTodoを作成
    await page.getByPlaceholder('Add a new todo...').fill('説明編集テスト');
    await page.keyboard.press('Enter');
    
    // 説明部分をクリックして編集モードにする
    await selectors.Todo説明を取得('説明編集テスト').click();
    
    // 編集モードになったことを確認
    const isEditMode = await selectors.説明が編集モードか確認('説明編集テスト');
    expect(isEditMode).toBe(true);
    
    // 説明を入力
    const editTextarea = selectors.説明編集入力フィールドを取得('説明編集テスト');
    await editTextarea.fill('これはテスト用の説明です');
    await editTextarea.press('Escape');
    
    // 説明が保存されたことを確認
    const descriptionText = await selectors.説明テキストを取得('説明編集テスト');
    expect(descriptionText).toBe('これはテスト用の説明です');
  });
});