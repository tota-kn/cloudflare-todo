import { useNavigate } from "react-router"
import { createServerFetcher } from "~/client"
import { ActionButton } from "~/components/CircleButton"
import { ErrorMessage } from "~/components/ErrorMessage"
import { LoadingSpinner } from "~/components/LoadingSpinner"
import { TodoList } from "~/components/TodoList"
import { useTheme } from "~/contexts/ThemeContext"
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
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const { data: todos, isLoading, error } = useTodos(loaderData.todos)

  const currentTodos = todos || []

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
          <img
            src={`${loaderData.apiBaseUrl}/v1/assets/test.png`}
            alt="Test"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex items-center space-x-2">
          <ActionButton
            onClick={toggleTheme}
            variant={theme === "light" ? "theme-light" : "theme-dark"}
          />
          <div className="p-1">
            <ActionButton
              onClick={() => navigate("/todos/new")}
              variant="add-cancel"
              showCancel={false}
            />
          </div>
        </div>
      </div>

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
