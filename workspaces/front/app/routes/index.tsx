import { redirect } from "react-router"
import { defaultLanguage } from "~/i18n/config"

export async function loader() {
  // デフォルト言語（英語）にリダイレクト
  return redirect(`/${defaultLanguage}/todos`)
}
