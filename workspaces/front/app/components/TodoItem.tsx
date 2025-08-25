import { useNavigate, useLocation } from "react-router"
import { useDeleteTodo, useToggleTodo } from "~/hooks/useTodos"
import type { TodoDto } from "~/types/shared"
import { formatDateTime } from "~/utils/dateFormat"
import { ActionButton } from "./CircleButton"
import { useTranslation } from "~/i18n/client"

/**
 * TodoItemコンポーネントのProps
 */
interface TodoItemProps {
  todo: TodoDto
}

/**
 * Todoアイテムを表示するコンポーネント
 * 完了/未完了の切り替え、編集、削除機能を提供する
 * @param props コンポーネントのProps
 * @returns TodoItemコンポーネント
 */
export function TodoItem({ todo }: TodoItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const deleteTodo = useDeleteTodo()
  const toggleTodo = useToggleTodo()

  // 現在のパスから言語を検出
  const getCurrentLanguage = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean)
    const langFromPath = pathSegments[0]
    return ["en", "ja"].includes(langFromPath) ? langFromPath : "en"
  }

  const handleToggleComplete = () => {
    toggleTodo.mutate({ todoId: todo.id, completed: todo.completed })
  }

  const handleDelete = () => {
    if (confirm(t("Are you sure you want to delete this todo?"))) {
      deleteTodo.mutate(todo.id)
    }
  }

  const handleEdit = () => {
    const currentLang = getCurrentLanguage()
    navigate(`/${currentLang}/todos/${todo.id}`)
  }

  return (
    <div
      className={`border rounded-lg py-2 px-4 cursor-pointer hover:bg-accent/10 transition-colors ${
        todo.completed ? "bg-muted border-border" : "bg-card border-border"
      }`}
      onClick={handleEdit}
      title={t("Click to edit")}
    >
      <div className="flex items-center justify-between">
        <div className="mr-3" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            onClick={handleToggleComplete}
            disabled={toggleTodo.isPending}
            variant={todo.completed ? "toggle-pending" : "toggle-complete"}
            isLoading={toggleTodo.isPending}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold ${
              todo.completed
                ? "line-through text-muted-foreground"
                : "text-card-foreground"
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-0.5 text-sm ${
                todo.completed
                  ? "text-muted-foreground"
                  : "text-card-foreground"
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <div className="text-xs text-muted-foreground text-right">
            {todo.updated_at !== todo.created_at && (
              <div>{`${t("Updated")}: ${formatDateTime(todo.updated_at)}`}</div>
            )}
            <div
              className={todo.updated_at !== todo.created_at ? "mt-0.5" : ""}
            >
              {`${t("Created")}: ${formatDateTime(todo.created_at)}`}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ActionButton
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
              variant="delete"
              isLoading={deleteTodo.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
