import i18next from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"

export const supportedLanguages = ["en", "ja"] as const
export const defaultLanguage = "en"

export type SupportedLanguage = (typeof supportedLanguages)[number]
/**
 * 指定された値がサポートされている言語かどうかをチェックする型ガード関数
 */
export function isSupportedLanguage(
  value: unknown
): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    (supportedLanguages as readonly string[]).includes(value)
  )
}

export function createI18nInstance(language: string = defaultLanguage) {
  const instance = i18next.createInstance()

  instance
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: language,
      fallbackLng: defaultLanguage,
      supportedLngs: supportedLanguages,
      defaultNS: "common",
      fallbackNS: "common",
      interpolation: {
        escapeValue: false, // React already escapes by default
      },
      // クライアントサイドでの初期化を同期的に行う
      initImmediate: false,
    })

  return instance
}
