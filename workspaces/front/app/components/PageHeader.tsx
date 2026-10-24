import { useLocation, useNavigate } from "react-router"
import { ActionButton } from "~/components/CircleButton"
import { GoogleIcon } from "~/components/CustomIcon"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import type { SupportedLanguage } from "~/i18n/config"
import { useGoogleSignIn } from "~/hooks/useGoogleSignIn"
import { useTheme } from "~/contexts/ThemeContext"
import { useTranslation } from "~/i18n/client"
import { signOut, useSession } from "~/utils/auth-client"
import { getFrontUrl } from "~/utils/env"
import { getCurrentLanguage, getLanguageAwarePath } from "~/utils/language"

/**
 * ログイン中はユーザー名とサインアウト、未ログインなら Google サインインを出す
 * @param props.currentLang サインアウト後の遷移先に使う言語
 * @returns 認証状態に応じたボタン
 */
function AuthControl({ currentLang }: { currentLang: SupportedLanguage }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { signingIn, signInWithGoogle } = useGoogleSignIn(getFrontUrl())

  return session?.user ? (
    <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-md min-w-0">
      <span className="text-sm text-foreground font-medium truncate max-w-30 sm:max-w-50">
        {session.user.name || session.user.email}
      </span>
      <button
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                void navigate(getLanguageAwarePath(currentLang, "/todos"))
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
      onClick={signInWithGoogle}
      disabled={signingIn}
      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      <GoogleIcon />
      {signingIn ? t("Signing in...") : t("Sign in with Google")}
    </button>
  )
}

/**
 * PageHeaderコンポーネントのProps
 */
interface PageHeaderProps {
  titleKey: string
  logoUrl: string
  showNewTodoButton?: boolean
  showBackButton?: boolean
}

/**
 * ロゴとページタイトル
 * @param props.titleKey タイトルの翻訳キー
 * @param props.logoUrl ロゴ画像のURL
 * @returns タイトル部分
 */
function PageTitle({
  titleKey,
  logoUrl,
}: Pick<PageHeaderProps, "titleKey" | "logoUrl">) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <img
        src={logoUrl}
        alt={t("Test")}
        className="h-8 sm:h-10 object-contain"
      />
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        {t(titleKey)}
      </h1>
    </div>
  )
}

/**
 * ページ上部のロゴ・タイトルと、認証・言語・テーマ・画面遷移のボタン群
 * @param props コンポーネントのProps
 * @returns PageHeaderコンポーネント
 */
export function PageHeader({
  titleKey,
  logoUrl,
  showNewTodoButton = false,
  showBackButton = false,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const currentLang = getCurrentLanguage(useLocation().pathname)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <PageTitle titleKey={titleKey} logoUrl={logoUrl} />
      <div className="flex items-center flex-wrap gap-2">
        <AuthControl currentLang={currentLang} />
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
