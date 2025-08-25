import { createServerFetcher } from "~/client"
import { ErrorMessage } from "~/components/ErrorMessage"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { PageHeader } from "~/components/PageHeader"
import { TodoList } from "~/components/TodoList"
import { useTodos } from "~/hooks/useTodos"
import type { Route } from "./+types/index"

export function meta() {
  return [
    { title: "Todo List" },
    { name: "description", content: "Todo list page" },
  ]
}

export async function loader({ context }: Route.LoaderArgs) {
  const client = createServerFetcher(context.cloudflare.env)
  const req = await client.v1.todos.$get()
  const res = await req.json()

  if ("error" in res) {
    throw new Error(res.error)
  }

  return {
    todos: res.items,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  }
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { data: todos, isLoading, error } = useTodos(loaderData.todos)

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
