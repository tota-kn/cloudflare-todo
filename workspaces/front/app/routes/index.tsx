import { redirect } from "react-router"

export async function loader() {
  // デフォルト言語（英語）にリダイレクト
  return redirect("/en/todos")
}
