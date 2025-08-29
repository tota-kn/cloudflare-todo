import {
  type SupportedLanguage,
  defaultLanguage,
  isSupportedLanguage,
} from "~/i18n/config"

/**
 * パスから現在の言語を検出する
 */
export const getCurrentLanguage = (pathname: string): SupportedLanguage => {
  const pathSegments = pathname.split("/").filter(Boolean)
  const langFromPath = pathSegments[0]
  return isSupportedLanguage(langFromPath) ? langFromPath : defaultLanguage
}

/**
 * 言語プレフィックス付きのパスを生成する
 */
export const getLanguageAwarePath = (
  language: SupportedLanguage,
  path: string
): string => {
  return `/${language}${path}`
}
