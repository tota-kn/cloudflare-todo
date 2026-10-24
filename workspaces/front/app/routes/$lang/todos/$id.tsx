import { env } from "cloudflare:workers"
import { useState } from "react"
import { redirect, useNavigate } from "react-router"
import { createServerFetcher, requireAuth } from "~/client"
import { FormActions } from "~/components/FormActions"
import { PageHeader } from "~/components/PageHeader"
import { TodoEditor } from "~/components/TodoEditor"
import { getFormString } from "~/utils/form"
import { useUpdateTodo } from "~/hooks/useTodos"
import { useI18nLanguage } from "~/i18n/client"
import { defaultLanguage, isSupportedLanguage } from "~/i18n/config"
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

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang, id: todoId } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/${todoId}`)
  }

  if (!todoId) {
    throw new Error("Todo ID is required")
  }

  // 未認証の場合は/:lang/loginへリダイレクト
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, lang, cookie)

  // セッションCookieをバックエンドに中継
  const client = createServerFetcher(
    env,
    cookie ? { Cookie: cookie } : undefined
  )

  const req = await client.v1.todos[":todoId"].$get({ param: { todoId } })

  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todo: res,
    apiBaseUrl: env.API_BASE_URL,
    language: lang,
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  const { lang, id: todoId } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/${todoId}`)
  }

  if (!todoId) {
    throw new Error("Todo ID is required")
  }

  // 未認証の場合は/:lang/loginへリダイレクト
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, lang, cookie)

  // セッションCookieをバックエンドに中継
  const client = createServerFetcher(
    env,
    cookie ? { Cookie: cookie } : undefined
  )

  const formData = await request.formData()
  const title = getFormString(formData, "title")
  const description = getFormString(formData, "description")

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
  const updateTodo = useUpdateTodo()
  const [title, setTitle] = useState(loaderData.todo.title)
  const [description, setDescription] = useState(
    loaderData.todo.description || ""
  )

  useI18nLanguage(loaderData.language)

  const handleSave = () => {
    if (title.length > 0) {
      updateTodo.mutate(
        { todoId: loaderData.todo.id, title, description },
        {
          onSuccess: () => {
            void navigate(`/${loaderData.language}/todos`)
          },
        }
      )
    }
  }

  const handleCancel = () => {
    void navigate(`/${loaderData.language}/todos`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
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
        onSave={(newTitle, newDescription) => {
          setTitle(newTitle)
          setDescription(newDescription || "")
        }}
        showTimestamps
      />

      <FormActions
        onCancel={handleCancel}
        onSave={handleSave}
        canSave={title.length > 0}
        isSaving={updateTodo.isPending}
      />
    </div>
  )
}
