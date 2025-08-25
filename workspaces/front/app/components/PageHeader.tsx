import { useNavigate, useLocation } from "react-router"
import { ActionButton } from "~/components/CircleButton"
import { useTheme } from "~/contexts/ThemeContext"
import { useTranslation } from "~/i18n/client"
import {
  type SupportedLanguage,
  isSupportedLanguage,
  defaultLanguage,
} from "~/i18n/config"

interface PageHeaderProps {
  titleKey: string
  logoUrl: string
  showNewTodoButton?: boolean
  showBackButton?: boolean
}

export function PageHeader({
  titleKey,
  logoUrl,
  showNewTodoButton = false,
  showBackButton = false,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { t, changeLanguage } = useTranslation()

  // 現在のパスから言語を検出
  const getCurrentLanguage = (): SupportedLanguage => {
    const pathSegments = location.pathname.split("/").filter(Boolean)
    const langFromPath = pathSegments[0]
    return isSupportedLanguage(langFromPath) ? langFromPath : defaultLanguage
  }

  // 言語切り替え時のURL変更処理
  const handleLanguageSwitch = (newLanguage: string) => {
    const currentLang = getCurrentLanguage()
    const newPath = location.pathname.replace(
      `/${currentLang}`,
      `/${newLanguage}`
    )
    if (isSupportedLanguage(newLanguage)) {
      changeLanguage(newLanguage)
    }
    navigate(newPath)
  }

  // 現在の言語に基づいたナビゲーション
  const getLanguageAwarePath = (path: string) => {
    const currentLang = getCurrentLanguage()
    return `/${currentLang}${path}`
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt={t("Test")} className="h-12 object-contain" />
        <h1 className="text-3xl font-bold text-foreground">{t(titleKey)}</h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* 言語切り替えボタン */}
        <button
          onClick={() =>
            handleLanguageSwitch(
              getCurrentLanguage() === defaultLanguage ? "ja" : defaultLanguage
            )
          }
          className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors"
        >
          {getCurrentLanguage() === defaultLanguage ? "日本語" : "English"}
        </button>
        <ActionButton
          onClick={toggleTheme}
          variant={theme === "light" ? "theme-light" : "theme-dark"}
        />
        {showNewTodoButton && (
          <div className="p-1">
            <ActionButton
              onClick={() => navigate(getLanguageAwarePath("/todos/new"))}
              variant="add-cancel"
              showCancel={false}
            />
          </div>
        )}
        {showBackButton && (
          <button
            onClick={() => navigate(getLanguageAwarePath("/todos"))}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            ← {t("Back to List")}
          </button>
        )}
      </div>
    </div>
  )
}
