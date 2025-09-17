import { useNavigate, useLocation } from "react-router"
import { useState } from "react"
import { ActionButton } from "~/components/CircleButton"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { useTheme } from "~/contexts/ThemeContext"
import { useTranslation } from "~/i18n/client"
import { getCurrentLanguage, getLanguageAwarePath } from "~/utils/language"
import { useSession, signOut, signIn } from "~/utils/auth-client"

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
  const [signingIn, setSigningIn] = useState(false)

  const currentLang = getCurrentLanguage(location.pathname)

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt={t("Test")} className="h-12 object-contain" />
        <h1 className="text-3xl font-bold text-foreground">{t(titleKey)}</h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* ユーザー情報表示 */}
        {session?.user ? (
          <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/50 rounded-md">
            <span className="text-sm text-foreground font-medium">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={async () => {
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate(getLanguageAwarePath(currentLang, "/todos"))
                    },
                  },
                })
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
            >
              {t("Sign Out")}
            </button>
          </div>
        ) : (
          <button
            onClick={async () => {
              setSigningIn(true)
              await signIn.social(
                {
                  provider: "google",
                  callbackURL: "http://localhost:5173/",
                },
                {
                  onRequest: () => {
                    setSigningIn(true)
                  },
                  onResponse: () => {
                    setSigningIn(false)
                  },
                }
              )
            }}
            disabled={signingIn}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.98em"
              height="1em"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            {signingIn ? "Signing in..." : "Sign in with Google"}
          </button>
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
