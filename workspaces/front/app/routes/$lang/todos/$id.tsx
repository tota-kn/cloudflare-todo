import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { createServerFetcher } from "~/client"
import { PageHeader } from "~/components/PageHeader"
import { TodoEditor } from "~/components/TodoEditor"
import { useUpdateTodo } from "~/hooks/useTodos"
import { isSupportedLanguage, defaultLanguage } from "~/i18n/config"
import { initI18nClient, useTranslation } from "~/i18n/client"
import { redirect } from "react-router"
import type { Route } from "./+types/$id"

export const links: Route.LinksFunction = () => {
  // Note: Dynamic params not available in links function,
  // alternate links will be handled via meta tags instead
  return []
}

export function meta({ params }: Route.MetaArgs) {
  const { lang, id } = params
  const isJapanese = lang === "ja"

  return [
    { title: isJapanese ? `Todo ${id}を編集` : `Edit Todo ${id}` },
    {
      name: "description",
      content: isJapanese ? "Todoアイテムを編集" : "Edit todo item",
    },
    {
      name: "og:title",
      content: isJapanese ? `Todo ${id}を編集` : `Edit Todo ${id}`,
    },
    {
      name: "og:description",
      content: isJapanese ? "Todoアイテムを編集" : "Edit todo item",
    },
    // Alternate language links for dynamic routes
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `/en/todos/${id}`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ja",
      href: `/ja/todos/${id}`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `/en/todos/${id}`,
    },
  ]
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const { lang, id: todoId } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/${todoId}`)
  }

  if (!todoId) {
    throw new Error("Todo ID is required")
  }

  const client = createServerFetcher(context.cloudflare.env)
  const req = await client.v1.todos[":todoId"].$get({ param: { todoId } })
  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todo: res,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
    language: lang,
  }
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const { lang, id: todoId } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/${todoId}`)
  }

  if (!todoId) {
    throw new Error("Todo ID is required")
  }

  const client = createServerFetcher(context.cloudflare.env)
  const formData = await request.formData()
  const title = String(formData.get("title") ?? "")
  const description = String(formData.get("description") ?? "")

  const req = await client.v1.todos[":todoId"].$put({
    param: { todoId },
    json: { title, description: description || undefined },
  })

  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return { todo: res }
}

export default function TodoEdit({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const updateTodo = useUpdateTodo()
  const [title, setTitle] = useState(loaderData.todo.title)
  const [description, setDescription] = useState(
    loaderData.todo.description || ""
  )

  // クライアントサイドでの言語初期化
  useEffect(() => {
    initI18nClient(loaderData.language)
  }, [loaderData.language])

  const handleSave = () => {
    if (title.length > 0) {
      updateTodo.mutate(
        { todoId: loaderData.todo.id, title, description },
        {
          onSuccess: () => {
            navigate(`/${loaderData.language}/todos`)
          },
        }
      )
    }
  }

  const handleCancel = () => {
    setTitle(loaderData.todo.title)
    setDescription(loaderData.todo.description || "")
    navigate(`/${loaderData.language}/todos`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        titleKey="Edit Todo"
        logoUrl={`${loaderData.apiBaseUrl}/v1/assets/logo.png`}
        showBackButton={true}
      />

      <TodoEditor
        mode="edit"
        initialTitle={title}
        initialDescription={description}
        todo={loaderData.todo}
        onSave={(newTitle: string, newDescription?: string) => {
          setTitle(newTitle)
          setDescription(newDescription || "")
        }}
        onCancel={() => {}}
        showTimestamps={true}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          {t("Cancel")}
        </button>
        <button
          onClick={handleSave}
          disabled={title.length === 0 || updateTodo.isPending}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateTodo.isPending ? t("Saving...") : t("Save")}
        </button>
      </div>
    </div>
  )
}
