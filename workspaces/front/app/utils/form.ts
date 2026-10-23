/**
 * FormData から文字列の値を取り出す。
 * キーが無いときやファイルが送られてきたときは空文字を返す。
 * @param formData 送信されたフォームデータ
 * @param name フィールド名
 * @returns フィールドの文字列値
 */
export function getFormString(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}
