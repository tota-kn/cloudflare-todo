import { redirect } from "react-router"
import type { Route } from "./+types/index"
import { supportedLanguages } from "~/i18n/config"

export async function loader({ params }: Route.LoaderArgs) {
  const { lang } = params
  
  // 言語パラメータの検証
  if (!lang || !supportedLanguages.includes(lang as any)) {
    return redirect("/en/todos")
  }
  
  // /:lang → /:lang/todos にリダイレクト
  return redirect(`/${lang}/todos`)
}