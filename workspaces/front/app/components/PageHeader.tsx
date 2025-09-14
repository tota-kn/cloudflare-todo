import { useNavigate, useLocation } from "react-router"
import { ActionButton } from "~/components/CircleButton"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { useTheme } from "~/contexts/ThemeContext"
import { useTranslation } from "~/i18n/client"
import { getCurrentLanguage, getLanguageAwarePath } from "~/utils/language"
import { useSession, signOut } from "~/utils/auth-client"

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
  const { t } = useTranslation()
  const { data: session } = useSession()

  const currentLang = getCurrentLanguage(location.pathname)

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt={t("Test")} className="h-12 object-contain" />
        <h1 className="text-3xl font-bold text-foreground">{t(titleKey)}</h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* ユーザー名表示（ログイン時のみ） */}
        {session?.user && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/50 rounded-md">
            <span className="text-sm text-foreground font-medium">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
            >
              {t("Sign Out")}
            </button>
          </div>
        )}
        {/* 言語切り替えボタン */}
        <LanguageSwitcher />
        <ActionButton
          onClick={toggleTheme}
          variant={theme === "light" ? "theme-light" : "theme-dark"}
        />
        {showNewTodoButton && (
          <div className="p-1">
            <ActionButton
              onClick={() =>
                navigate(getLanguageAwarePath(currentLang, "/todos/new"))
              }
              variant="add-cancel"
              showCancel={false}
            />
          </div>
        )}
        {showBackButton && (
          <button
            onClick={() =>
              navigate(getLanguageAwarePath(currentLang, "/todos"))
            }
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            ← {t("Back to List")}
          </button>
        )}
      </div>
    </div>
  )
}
