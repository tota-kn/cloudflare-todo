import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { useTranslation } from "~/i18n/client"
import { supportedLanguages, type SupportedLanguage } from "~/i18n/config"
import { getCurrentLanguage } from "~/utils/language"

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
 * 言語切り替えドロップダウンコンポーネント
 */
export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { changeLanguage } = useTranslation()

  const currentLanguage = getCurrentLanguage(location.pathname)

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 言語切り替え処理
  const handleLanguageSwitch = (newLanguage: SupportedLanguage) => {
    const newPath = location.pathname.replace(
      `/${currentLanguage}`,
      `/${newLanguage}`
    )

    changeLanguage(newLanguage)
    navigate(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* メインボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getLanguageDisplayName(currentLanguage)}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[120px]">
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageSwitch(lang)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md ${
                lang === currentLanguage
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-popover-foreground"
              }`}
              disabled={lang === currentLanguage}
            >
              {getLanguageDisplayName(lang)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
