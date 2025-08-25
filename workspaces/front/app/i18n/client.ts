import { useState } from "react"
import {
  initReactI18next,
  useTranslation as useI18nextTranslation,
} from "react-i18next"
import type { i18n } from "i18next"
import {
  createI18nInstance,
  type SupportedLanguage,
  defaultLanguage,
  isSupportedLanguage,
} from "./config"

let clientI18nInstance: i18n | null = null

export function initI18nClient(language: SupportedLanguage = defaultLanguage) {
  if (clientI18nInstance) {
    // すでに初期化されている場合は言語を変更するだけ
    if (clientI18nInstance.language !== language) {
      clientI18nInstance.changeLanguage(language)
    }
    return clientI18nInstance
  }

  clientI18nInstance = createI18nInstance(language)
  clientI18nInstance.use(initReactI18next)

  // 同期的に初期化を完了させる
  if (!clientI18nInstance.isInitialized) {
    clientI18nInstance.init()
  }

  return clientI18nInstance
}

export function useTranslation() {
  // 必要に応じてi18nインスタンスを初期化
  if (!clientI18nInstance) {
    initI18nClient(defaultLanguage)
  }

  const { t, i18n } = useI18nextTranslation("common", {
    i18n: clientI18nInstance!,
  })

  const [isInitialized] = useState(true) // 初期化済みと仮定

  const changeLanguage = (language: SupportedLanguage) => {
    if (clientI18nInstance) {
      clientI18nInstance.changeLanguage(language)
      // 言語変更時にURLも更新する処理はここに追加可能
    }
  }

  return {
    t,
    i18n,
    isInitialized,
    changeLanguage,
    currentLanguage: isSupportedLanguage(i18n?.language)
      ? i18n.language
      : defaultLanguage,
  }
}
