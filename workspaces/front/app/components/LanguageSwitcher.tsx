import { type RefObject, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useTranslation } from "~/i18n/client"
import { supportedLanguages, type SupportedLanguage } from "~/i18n/config"
import { getCurrentLanguage } from "~/utils/language"
import { ChevronDownIcon } from "./CustomIcon"

/**
 * 言語名を表示用に変換する
 */
const getLanguageDisplayName = (lang: SupportedLanguage): string => {
  const displayNames = {
    en: "English",
    ja: "日本語",
  } as const
  return displayNames[lang]
}

/**
 * ref の要素の外側がクリックされたら閉じる
 * @param ref 内側とみなす要素
 * @param setOpen 開閉の setState。毎回作り直す関数だとリスナーを張り直すので、setState をそのまま渡す
 */
const useCloseOnOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  setOpen: (open: boolean) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, setOpen])
}

/**
 * 言語の選択肢。表示中の言語は選べない
 * @param props.current 表示中の言語
 * @param props.onSelect 言語を選んだときの処理
 * @returns ドロップダウンメニュー
 */
function LanguageMenu({
  current,
  onSelect,
}: {
  current: SupportedLanguage
  onSelect: (lang: SupportedLanguage) => void
}) {
  return (
    <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-30">
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md ${
            lang === current
              ? "bg-accent text-accent-foreground font-medium"
              : "text-popover-foreground"
          }`}
          disabled={lang === current}
        >
          {getLanguageDisplayName(lang)}
        </button>
      ))}
    </div>
  )
}

/**
 * 言語切り替えドロップダウンコンポーネント
 * @returns LanguageSwitcherコンポーネント
 */
export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { changeLanguage } = useTranslation()

  const currentLanguage = getCurrentLanguage(location.pathname)

  useCloseOnOutsideClick(dropdownRef, setIsOpen)

  // 言語切り替え処理
  const handleLanguageSwitch = (newLanguage: SupportedLanguage) => {
    const newPath = location.pathname.replace(
      `/${currentLanguage}`,
      `/${newLanguage}`
    )

    changeLanguage(newLanguage)
    void navigate(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getLanguageDisplayName(currentLanguage)}
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <LanguageMenu
          current={currentLanguage}
          onSelect={handleLanguageSwitch}
        />
      )}
    </div>
  )
}
