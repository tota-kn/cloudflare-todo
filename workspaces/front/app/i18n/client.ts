import { useEffect } from "react"
import {
  initReactI18next,
  useTranslation as useI18nextTranslation,
} from "react-i18next"
import type { i18n } from "i18next"
import {
  createI18nInstance,
  type SupportedLanguage,
  defaultLanguage,
} from "./config"

let clientI18nInstance: i18n | null = null

/**
 * クライアント用の i18n インスタンスを一度だけ作り、以降は言語だけ切り替える
 * @param language 使う言語
 * @returns クライアント用の i18n インスタンス
 */
function initI18nClient(language: SupportedLanguage = defaultLanguage) {
  if (clientI18nInstance) {
    // すでに初期化されている場合は言語を変更するだけ
    if (clientI18nInstance.language !== language) {
      void clientI18nInstance.changeLanguage(language)
    }
    return clientI18nInstance
  }

  clientI18nInstance = createI18nInstance(language)
  clientI18nInstance.use(initReactI18next)

  // 同期的に初期化を完了させる
  if (!clientI18nInstance.isInitialized) {
    void clientI18nInstance.init()
  }

  return clientI18nInstance
}

/**
 * ページの言語に合わせてクライアントの i18n を初期化・切り替えする
 * @param language ページの言語（loader が URL から決めたもの）
 */
export function useI18nLanguage(language: SupportedLanguage) {
  useEffect(() => {
    initI18nClient(language)
  }, [language])
}

/**
 * 翻訳関数と言語切り替えを返す。i18n が未初期化なら既定の言語で初期化する
 * @returns 翻訳関数 t と、言語を切り替える changeLanguage
 */
export function useTranslation() {
  // 必要に応じてi18nインスタンスを初期化
  const instance = clientI18nInstance ?? initI18nClient(defaultLanguage)
  const { t } = useI18nextTranslation("common", { i18n: instance })

  const changeLanguage = (language: SupportedLanguage) => {
    void instance.changeLanguage(language)
  }

  return { t, changeLanguage }
}
