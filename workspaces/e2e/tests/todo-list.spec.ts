import { expect, test } from "@playwright/test";
import { TodoUIヘルパー } from "../helpers/ui-helpers";

test("複数のTodoが更新日時の降順で表示され、完了状態でセクション分けされる", async ({
  page,
}) => {
  const ui = new TodoUIヘルパー(page);

  const prefix = `並び順テスト ${Date.now()}`;
  const titleA = `${prefix} A`;
  const titleB = `${prefix} B`;
  const descriptionA = `${prefix} Aの説明文です`;
  const descriptionB = `${prefix} Bの説明文です`;
  const editedDescriptionA = `${prefix} Aの編集後の説明文です`;

  await ui.Todoページへ移動();
  await ui.Todo作成(titleA, descriptionA);
  await ui.Todo作成(titleB, descriptionB);

  // 後から作成したBが先に表示される（updated_at降順）
  await ui.未完了Todo表示確認(titleA);
  await ui.未完了Todo表示確認(titleB);
  await expect(ui.プレフィックスでTodo見出し取得(prefix)).toHaveText([
    titleB,
    titleA,
  ]);

  // Aを編集するとupdated_atが更新され、Aが先頭に並び替わる
  await ui.Todo編集ページへ移動(titleA);
  await ui.Todoフォームクリア入力(titleA, editedDescriptionA);
  await ui.Todo保存();
  await ui.Todo表示確認(titleA, editedDescriptionA);
  await expect(ui.プレフィックスでTodo見出し取得(prefix)).toHaveText([
    titleA,
    titleB,
  ]);

  // Bを完了すると、Aは未完了セクション、Bは完了セクションに分かれる
  await ui.Todo完了(titleB);
  await ui.完了Todo表示確認(titleB);
  await ui.未完了Todo表示確認(titleA);
});
