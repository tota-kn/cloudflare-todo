import { useEffect, useState } from "react"
import { redirect } from "react-router"
import { checkSession } from "~/client"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { useTheme } from "~/contexts/ThemeContext"
import { initI18nClient, useTranslation } from "~/i18n/client"
import { defaultLanguage, isSupportedLanguage } from "~/i18n/config"
import { signIn } from "~/utils/auth-client"
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

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/login`)
  }

  // 認証済みの場合はtodosへリダイレクト
  const cookie = request.headers.get("Cookie")
  const authenticated = await checkSession(context.cloudflare.env, cookie)
  if (authenticated) {
    return redirect(`/${lang}/todos`)
  }

  return {
    language: lang,
  }
}

/**
 * ログインページコンポーネント
 * 未認証ユーザーにGoogleサインインボタンを表示する
 */
export default function Login({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [signingIn, setSigningIn] = useState(false)

  // クライアントサイドでの言語初期化
  useEffect(() => {
    initI18nClient(loaderData.language)
  }, [loaderData.language])

  const todosPath = `${getFrontUrl()}${getLanguageAwarePath(loaderData.language, "/todos")}`

  const handleSignIn = async () => {
    setSigningIn(true)
    await signIn.social(
      {
        provider: "google",
        callbackURL: todosPath,
      },
      {
        onResponse: () => {
          setSigningIn(false)
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      {/* 言語切り替え・テーマ切り替え（右上に配置） */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-secondary/80 transition-colors text-foreground"
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            // Moon icon
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            // Sun icon
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-lg p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-foreground">{t("Sign In")}</h1>
        <p className="text-sm text-muted-foreground text-center">
          {t("Sign in to manage your todos")}
        </p>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {/* Google icon */}
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
          {signingIn ? t("Signing in...") : t("Sign in with Google")}
        </button>
      </div>
    </div>
  )
}
