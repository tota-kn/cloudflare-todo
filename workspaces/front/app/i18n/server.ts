import {
  createI18nInstance,
  type SupportedLanguage,
  isSupportedLanguage,
  defaultLanguage,
} from "./config"

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
  const langFromPath = pathSegments[0]

  // サポートされている言語の場合はそれを返す、そうでなければデフォルト
  if (isSupportedLanguage(langFromPath)) {
    return langFromPath
  }

  return defaultLanguage // デフォルト言語
}
