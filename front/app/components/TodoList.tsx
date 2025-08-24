import { useCreateTodo } from "~/hooks/useTodos"
import { sortTodosByUpdatedAt } from "~/utils/todoSort"
import type { TodoItem as TodoItemData } from "../../../shared/client"
import { TodoEditor } from "./TodoEditor"
import { TodoItem } from "./TodoItem"

/**
 * TodoSectionコンポーネントのProps
 */
interface TodoSectionProps {
  title: string
  todos: TodoItemData[]
}

/**
 * Todoセクションを表示するコンポーネント
 * 完了済み・未完了のTodoをグループ化して表示する
 * @param props コンポーネントのProps
 * @returns TodoSectionコンポーネント
 */
function TodoSection({ title, todos }: TodoSectionProps) {
  if (todos.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}

/**
 * TodoListコンポーネントのProps
 */
interface TodoListProps {
  todos: TodoItemData[]
  showNewTodoForm?: boolean
  onCancelNewTodo?: () => void
}

/**
 * Todo一覧を表示するメインコンポーネント
 * 未完了・完了済みでセクション分けし、新規作成フォームも含む
 * @param props コンポーネントのProps
 * @returns TodoListコンポーネント
 */
export function TodoList({
  todos,
  showNewTodoForm,
  onCancelNewTodo,
}: TodoListProps) {
  const createTodo = useCreateTodo()

  const incompleteTodos = sortTodosByUpdatedAt(
    todos.filter((todo) => !todo.completed)
  )
  const completedTodos = sortTodosByUpdatedAt(
    todos.filter((todo) => todo.completed)
  )

  const handleSave = (title: string, description?: string) => {
    createTodo.mutate({ title, description }, { onSuccess: onCancelNewTodo })
  }

  return (
    <div className="space-y-6">
      {showNewTodoForm && onCancelNewTodo && (
        <TodoEditor
          mode="create"
          onSave={handleSave}
          onCancel={onCancelNewTodo}
          isSaving={createTodo.isPending}
        />
      )}

      {todos.length === 0 && !showNewTodoForm ? (
        <p className="text-black text-center py-8">
          No todos found. Create your first todo!
        </p>
      ) : (
        <>
          <TodoSection title="Pending Tasks" todos={incompleteTodos} />
          <TodoSection title="Completed Tasks" todos={completedTodos} />
        </>
      )}
    </div>
  )
}
