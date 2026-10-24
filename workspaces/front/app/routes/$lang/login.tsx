import { env } from "cloudflare:workers"
import { redirect } from "react-router"
import { checkSession } from "~/client"
import { GoogleIcon, MoonIcon, SunIcon } from "~/components/CustomIcon"
import { useGoogleSignIn } from "~/hooks/useGoogleSignIn"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { useTheme } from "~/contexts/ThemeContext"
import { useI18nLanguage, useTranslation } from "~/i18n/client"
import { defaultLanguage, isSupportedLanguage } from "~/i18n/config"
import { getFrontUrl } from "~/utils/env"
import { getLanguageAwarePath } from "~/utils/language"
import type { Route } from "./+types/login"

export function meta({ params }: Route.MetaArgs) {
  const { lang } = params
  const isJapanese = lang === "ja"

  return [
    { title: isJapanese ? "ログイン" : "Sign In" },
    {
      name: "description",
      content: isJapanese ? "Todoアプリにログインする" : "Sign in to Todo App",
    },
  ]
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/login`)
  }

  // 認証済みの場合はtodosへリダイレクト
  const cookie = request.headers.get("Cookie")
  const authenticated = await checkSession(env, cookie)
  if (authenticated) {
    return redirect(`/${lang}/todos`)
  }

  return {
    language: lang,
  }
}

/**
 * テーマ切り替えボタン（アイコンのみの控えめな見た目）
 * @returns ThemeToggleコンポーネント
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-secondary/80 transition-colors text-foreground"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

/**
 * ログインページコンポーネント
 * 未認証ユーザーにGoogleサインインボタンを表示する
 */
export default function Login({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  useI18nLanguage(loaderData.language)

  const { signingIn, signInWithGoogle } = useGoogleSignIn(
    `${getFrontUrl()}${getLanguageAwarePath(loaderData.language, "/todos")}`
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6">
      {/* 言語切り替え・テーマ切り替え（右上に配置） */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-foreground">{t("Sign In")}</h1>
        <p className="text-sm text-muted-foreground text-center">
          {t("Sign in to manage your todos")}
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={signingIn}
          className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <GoogleIcon />
          {signingIn ? t("Signing in...") : t("Sign in with Google")}
        </button>
      </div>
    </div>
  )
}
