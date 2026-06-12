import i18next, { type i18n } from "i18next"
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

/**
 * 指定言語で初期化したi18nextインスタンスを生成する
 *
 * 戻り値型を明示しないと推論型がnode_modules内のパスを参照し、
 * 宣言ファイル生成時にTS2742(not portable)エラーになるため注釈必須。
 *
 * @param language - 初期言語(デフォルト: defaultLanguage)
 * @returns 初期化済みのi18nextインスタンス
 */
export function createI18nInstance(language: string = defaultLanguage): i18n {
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
