import { useLocation, useNavigate } from "react-router"
import {
  isOptimisticTodo,
  useDeleteTodo,
  useToggleTodo,
} from "~/hooks/useTodos"
import { useTranslation } from "~/i18n/client"
import type { TodoDto } from "~/types/shared"
import { getCurrentLanguage, getLanguageAwarePath } from "~/utils/language"
import { ActionButton } from "./CircleButton"
import { TodoTimestamps } from "./TodoTimestamps"

/**
 * TodoItemコンポーネントのProps
 */
interface TodoItemProps {
  todo: TodoDto
}

/**
 * Todoのタイトル・説明・日時。完了済みは取り消し線と沈んだ色で出す
 * @param props.todo 表示するTodo
 * @returns テキスト部分
 */
function TodoText({ todo }: TodoItemProps) {
  const textColor = todo.completed
    ? "text-muted-foreground"
    : "text-card-foreground"

  return (
    <div className="flex-1 min-w-0">
      <h3
        className={`text-base font-semibold wrap-break-word ${todo.completed ? "line-through " : ""}${textColor}`}
      >
        {todo.title}
      </h3>
      {todo.description && (
        <p className={`mt-0.5 text-sm wrap-break-word ${textColor}`}>
          {todo.description}
        </p>
      )}
      <TodoTimestamps todo={todo} />
    </div>
  )
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

  const currentLang = getCurrentLanguage(location.pathname)
  // 保存前のTodoは仮IDなので、遷移やAPI呼び出しに使うと存在しないTodoを指してしまう
  const isSaving = isOptimisticTodo(todo)

  const handleDelete = () => {
    if (confirm(t("Are you sure you want to delete this todo?"))) {
      deleteTodo.mutate(todo.id)
    }
  }

  const handleEdit = () => {
    if (isSaving) return
    void navigate(getLanguageAwarePath(currentLang, `/todos/${todo.id}`))
  }

  return (
    <div
      className={`border rounded-lg py-2 px-4 cursor-pointer hover:bg-accent/10 transition-colors ${
        todo.completed ? "bg-muted border-border" : "bg-card border-border"
      } ${isSaving ? "opacity-60 cursor-progress" : ""}`}
      onClick={handleEdit}
      title={t("Click to edit")}
      aria-disabled={isSaving}
    >
      <div className="flex items-center">
        <div className="mr-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            onClick={() =>
              toggleTodo.mutate({ todoId: todo.id, completed: todo.completed })
            }
            disabled={isSaving || toggleTodo.isPending}
            variant={todo.completed ? "toggle-pending" : "toggle-complete"}
            isLoading={toggleTodo.isPending}
          />
        </div>
        <TodoText todo={todo} />
        <div className="ml-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            onClick={handleDelete}
            disabled={isSaving || deleteTodo.isPending}
            variant="delete"
            isLoading={deleteTodo.isPending}
          />
        </div>
      </div>
    </div>
  )
}
