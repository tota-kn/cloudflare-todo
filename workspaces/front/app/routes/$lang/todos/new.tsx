import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { createServerFetcher } from "~/client"
import { PageHeader } from "~/components/PageHeader"
import { TodoEditor } from "~/components/TodoEditor"
import { useCreateTodo } from "~/hooks/useTodos"
import { isSupportedLanguage, defaultLanguage } from "~/i18n/config"
import { initI18nClient, useTranslation } from "~/i18n/client"
import { redirect } from "react-router"
import type { Route } from "./+types/new"

export const links: Route.LinksFunction = () => {
  const currentPath = "/todos/new"

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
    { title: isJapanese ? "新しいTodoを作成" : "Create New Todo" },
    {
      name: "description",
      content: isJapanese
        ? "新しいTodoアイテムを作成"
        : "Create a new todo item",
    },
    {
      name: "og:title",
      content: isJapanese ? "新しいTodoを作成" : "Create New Todo",
    },
    {
      name: "og:description",
      content: isJapanese
        ? "新しいTodoアイテムを作成"
        : "Create a new todo item",
    },
  ]
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/new`)
  }

  return {
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
    language: lang,
  }
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/new`)
  }

  const client = createServerFetcher(context.cloudflare.env)

  const formData = await request.formData()
  const title = String(formData.get("title") ?? "")
  const description = String(formData.get("description") ?? "")

  const req = await client.v1.todos.$post({
    json: { title, description: description || undefined },
  })

  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return { todo: res }
}

export default function TodoNew({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const createTodo = useCreateTodo()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // クライアントサイドでの言語初期化
  useEffect(() => {
    initI18nClient(loaderData.language)
  }, [loaderData.language])

  const handleSave = () => {
    if (title.length > 0) {
      createTodo.mutate(
        { title, description },
        {
          onSuccess: () => {
            navigate(`/${loaderData.language}/todos`)
          },
        }
      )
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    navigate(`/${loaderData.language}/todos`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        titleKey="Create New Todo"
        logoUrl={`${loaderData.apiBaseUrl}/v1/assets/logo.png`}
        showBackButton={true}
      />

      <TodoEditor
        mode="create"
        initialTitle={title}
        initialDescription={description}
        todo={undefined}
        onSave={(newTitle: string, newDescription?: string) => {
          setTitle(newTitle)
          setDescription(newDescription || "")
        }}
        onCancel={() => {}}
        showTimestamps={false}
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
          disabled={title.length === 0 || createTodo.isPending}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTodo.isPending ? t("Saving...") : t("Save")}
        </button>
      </div>
    </div>
  )
}
