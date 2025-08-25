import { createServerFetcher } from "~/client"
import { ErrorMessage } from "~/components/ErrorMessage"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { PageHeader } from "~/components/PageHeader"
import { TodoList } from "~/components/TodoList"
import { useTodos } from "~/hooks/useTodos"
import { isSupportedLanguage } from "~/i18n/config"
import { initI18nClient } from "~/i18n/client"
import { redirect } from "react-router"
import { useEffect } from "react"
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

export async function loader({ params, context }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect("/en/todos")
  }

  const client = createServerFetcher(context.cloudflare.env)
  const req = await client.v1.todos.$get()
  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todos: res.items,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
    language: lang,
  }
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { data: todos, isLoading, error } = useTodos(loaderData.todos)

  // クライアントサイドでの言語初期化
  useEffect(() => {
    initI18nClient(loaderData.language)
  }, [loaderData.language])

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
