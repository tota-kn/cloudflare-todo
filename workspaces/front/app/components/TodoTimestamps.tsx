import { useTranslation } from "~/i18n/client"
import type { TodoDto } from "~/types/shared"
import { formatDateTime } from "~/utils/dateFormat"

/**
 * Todoの作成日時と、更新されていれば更新日時を表示する
 * @param props.todo 表示するTodo
 * @returns 日時表示
 */
export function TodoTimestamps({ todo }: { todo: TodoDto }) {
  const { t } = useTranslation()

  return (
    <div className="text-xs text-muted-foreground mt-1">
      {todo.updated_at !== todo.created_at && (
        <div>{`${t("Updated")}: ${formatDateTime(todo.updated_at)}`}</div>
      )}
      <div>{`${t("Created")}: ${formatDateTime(todo.created_at)}`}</div>
    </div>
  )
}
