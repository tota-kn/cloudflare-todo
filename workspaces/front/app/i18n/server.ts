import { createI18nInstance, type SupportedLanguage } from "./config"

export async function initI18nServer(language: SupportedLanguage) {
  const i18n = createI18nInstance(language)

  // サーバーサイドでは翻訳リソースが完全にロードされるまで待つ
  await i18n.loadLanguages(language)

  return i18n
}

export function getLanguageFromRequest(request: Request): SupportedLanguage {
  // URL パスから言語を抽出 (例: /en/todos, /ja/todos)
  const url = new URL(request.url)
  const pathSegments = url.pathname.split("/").filter(Boolean)
  const langFromPath = pathSegments[0] as SupportedLanguage

  // サポートされている言語の場合はそれを返す、そうでなければデフォルト
  if (langFromPath && ["en", "ja"].includes(langFromPath)) {
    return langFromPath
  }

  return "en" // デフォルト言語
}
