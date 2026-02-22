import { useEffect } from "react"
import { redirect, useNavigate } from "react-router"
import { createServerFetcher, requireAuth } from "~/client"
import { ErrorMessage } from "~/components/ErrorMessage"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { PageHeader } from "~/components/PageHeader"
import { TodoList } from "~/components/TodoList"
import { useTodos } from "~/hooks/useTodos"
import { initI18nClient } from "~/i18n/client"
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

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos`)
  }

  // 未認証の場合は/:lang/loginへリダイレクト
  const cookie = request.headers.get("Cookie")
  await requireAuth(context.cloudflare.env, lang, cookie)

  // セッションCookieをバックエンドに中継
  const client = createServerFetcher(
    context.cloudflare.env,
    cookie ? { Cookie: cookie } : undefined
  )

  const req = await client.v1.todos.$get()

  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todos: res.items,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
    language: lang,
    isAuthenticated: true,
  }
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { data: session } = useSession()
  // SSRではcross-originのためセッションCookieが取得できない場合がある
  // クライアントサイドのuseSession()で補完する
  const isAuthenticated = loaderData.isAuthenticated || !!session?.user
  const {
    data: todos,
    isLoading,
    error,
  } = useTodos(isAuthenticated ? (loaderData.todos ?? []) : undefined)

  // クライアントサイドでの言語初期化
  useEffect(() => {
    initI18nClient(loaderData.language)
  }, [loaderData.language])

  // クライアントサイドで未認証が確定した場合はログインページへリダイレクト
  useEffect(() => {
    if (!isAuthenticated || todos === null) {
      navigate(`/${loaderData.language}/login`)
    }
  }, [isAuthenticated, todos, navigate, loaderData.language])

  if (!isAuthenticated || todos === null) {
    return null
  }

  const currentTodos = todos || []

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        titleKey="Todo List"
        logoUrl={`${loaderData.apiBaseUrl}/v1/assets/logo.png`}
        showNewTodoButton={true}
      />

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error.message} />}

      {!isLoading && (
        <TodoList
          todos={currentTodos}
          showNewTodoForm={false}
          onCancelNewTodo={() => {}}
        />
      )}
    </div>
  )
}
