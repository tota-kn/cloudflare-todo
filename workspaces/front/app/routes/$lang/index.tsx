import { redirect } from "react-router"
import { supportedLanguages, type SupportedLanguage } from "~/i18n/config"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!lang || !supportedLanguages.includes(lang as SupportedLanguage)) {
    return redirect("/en/todos")
  }

  // /:lang → /:lang/todos にリダイレクト
  return redirect(`/${lang}/todos`)
}
