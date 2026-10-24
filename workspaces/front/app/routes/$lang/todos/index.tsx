import { env } from "cloudflare:workers"
import { useEffect } from "react"
import { redirect, useNavigate } from "react-router"
import { createServerFetcher, requireAuth } from "~/client"
import { ErrorMessage } from "~/components/ErrorMessage"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { PageHeader } from "~/components/PageHeader"
import { TodoList } from "~/components/TodoList"
import { useTodos } from "~/hooks/useTodos"
import { useI18nLanguage } from "~/i18n/client"
import { defaultLanguage, isSupportedLanguage } from "~/i18n/config"
import { useSession } from "~/utils/auth-client"
import type { Route } from "./+types/index"

export const links: Route.LinksFunction = () => {
  const currentPath = "/todos"

  return [
    // Alternate language links for SEO
    {
      rel: "alternate",
      hrefLang: "en",
      href: `/en${currentPath}`,
    },
    {
      rel: "alternate",
      hrefLang: "ja",
      href: `/ja${currentPath}`,
    },
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: `/en${currentPath}`,
    },
  ]
}

export function meta({ params }: Route.MetaArgs) {
  const { lang } = params
  const isJapanese = lang === "ja"

  return [
    { title: isJapanese ? "Todoリスト" : "Todo List" },
    {
      name: "description",
      content: isJapanese ? "Todoリストページ" : "Todo list page",
    },
    { name: "og:title", content: isJapanese ? "Todoリスト" : "Todo List" },
    {
      name: "og:description",
      content: isJapanese ? "Todoリストページ" : "Todo list page",
    },
  ]
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos`)
  }

  // 未認証の場合は/:lang/loginへリダイレクト
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, lang, cookie)

  // セッションCookieをバックエンドに中継
  const client = createServerFetcher(
    env,
    cookie ? { Cookie: cookie } : undefined
  )

  const req = await client.v1.todos.$get()

  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todos: res.items,
    apiBaseUrl: env.API_BASE_URL,
    language: lang,
    isAuthenticated: true,
  }
}

/**
 * ログイン済みなら Todo 一覧を取得し、未ログインが確定したらログインページへ送る
 * @param loaderData loader の結果
 * @returns 一覧のクエリ結果と、ログインページへ送るべきか
 */
const useTodosOrLogin = (loaderData: Route.ComponentProps["loaderData"]) => {
  const navigate = useNavigate()
  const { data: session } = useSession()
  // SSRではcross-originのためセッションCookieが取得できない場合がある
  // クライアントサイドのuseSession()で補完する
  const isAuthenticated = loaderData.isAuthenticated || !!session?.user
  const query = useTodos(isAuthenticated ? (loaderData.todos ?? []) : undefined)
  // todos が null なのは API が 401 を返したとき
  const mustLogin = !isAuthenticated || query.data === null

  useEffect(() => {
    if (mustLogin) {
      void navigate(`/${loaderData.language}/login`)
    }
  }, [mustLogin, navigate, loaderData.language])

  return { ...query, mustLogin }
}

/**
 * Todo一覧ページ
 * @param props.loaderData loader の結果
 * @returns Todo一覧ページ
 */
export default function Todos({ loaderData }: Route.ComponentProps) {
  const {
    data: todos,
    isLoading,
    error,
    mustLogin,
  } = useTodosOrLogin(loaderData)

  useI18nLanguage(loaderData.language)

  if (mustLogin) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <PageHeader
        titleKey="Todo List"
        logoUrl={`${loaderData.apiBaseUrl}/v1/assets/logo.png`}
        showNewTodoButton={true}
      />

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error.message} />}

      {!isLoading && (
        <TodoList
          todos={todos ?? []}
          showNewTodoForm={false}
          onCancelNewTodo={() => {}}
        />
      )}
    </div>
  )
}
