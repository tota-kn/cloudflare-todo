import { env } from "cloudflare:workers"
import { useState } from "react"
import { redirect, useNavigate } from "react-router"
import { createServerFetcher, requireAuth } from "~/client"
import { FormActions } from "~/components/FormActions"
import { PageHeader } from "~/components/PageHeader"
import { TodoEditor } from "~/components/TodoEditor"
import { getFormString } from "~/utils/form"
import { useCreateTodo } from "~/hooks/useTodos"
import { useI18nLanguage } from "~/i18n/client"
import { defaultLanguage, isSupportedLanguage } from "~/i18n/config"
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

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/new`)
  }

  // 未認証の場合は/:lang/loginへリダイレクト
  const cookie = request.headers.get("Cookie")
  await requireAuth(env, lang, cookie)

  return {
    apiBaseUrl: env.API_BASE_URL,
    language: lang,
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  const { lang } = params

  // 言語パラメータの検証
  if (!isSupportedLanguage(lang)) {
    return redirect(`/${defaultLanguage}/todos/new`)
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
  const createTodo = useCreateTodo()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useI18nLanguage(loaderData.language)

  const handleSave = () => {
    if (title.length > 0) {
      createTodo.mutate(
        { title, description },
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
        titleKey="Create New Todo"
        logoUrl={`${loaderData.apiBaseUrl}/v1/assets/logo.png`}
        showBackButton={true}
      />

      <TodoEditor
        mode="create"
        initialTitle={title}
        initialDescription={description}
        onSave={(newTitle, newDescription) => {
          setTitle(newTitle)
          setDescription(newDescription || "")
        }}
      />

      <FormActions
        onCancel={handleCancel}
        onSave={handleSave}
        canSave={title.length > 0}
        isSaving={createTodo.isPending}
      />
    </div>
  )
}
