import { useEffect, useState } from "react"
import { formatDateTime } from "~/utils/dateFormat"
import type { TodoItem as TodoItemData } from "../../../shared/client"
import { ActionButton } from "./CircleButton"
import { TodoInput } from "./TodoInput"

interface TodoEditorProps {
  mode: "create" | "edit"
  initialTitle?: string
  initialDescription?: string
  todo?: TodoItemData
  onSave: (title: string, description?: string) => void
  onCancel: () => void
  isSaving?: boolean
  showTimestamps?: boolean
}

export function TodoEditor({
  mode,
  initialTitle = "",
  initialDescription = "",
  todo,
  onSave,
  onCancel,
  showTimestamps = false,
}: TodoEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    setTitle(initialTitle)
    setDescription(initialDescription)
  }, [initialTitle, initialDescription])

  const handleSave = () => {
    if (canSave) {
      onSave(title, description || undefined)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onSave(newTitle, description || undefined)
  }

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription)
    onSave(title, newDescription || undefined)
  }

  const handleCancel = () => {
    setTitle(initialTitle)
    setDescription(initialDescription)
    onCancel()
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title) {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && title) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const canSave = title.length > 0

  return (
    <div
      className={`border rounded-lg py-2 px-4 ${
        mode === "create"
          ? "bg-card border-border animate-in slide-in-from-top-1 duration-200"
          : todo?.completed
            ? "bg-muted border-border"
            : "bg-card border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        {mode === "edit" && (
          <div className="mr-3">
            <ActionButton
              onClick={() => {}}
              variant={todo?.completed ? "toggle-pending" : "toggle-complete"}
              disabled={true}
            />
          </div>
        )}

        <TodoInput
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onTitleKeyDown={handleTitleKeyDown}
          onDescriptionKeyDown={handleDescriptionKeyDown}
          autoFocusTitle={true}
          showHelpText={mode === "create"}
          mode={mode}
        />

        <div className="flex items-center space-x-2 ml-3">
          {showTimestamps && todo && (
            <div className="text-xs text-muted-foreground text-right">
              {todo.updated_at !== todo.created_at && (
                <div>{`Updated: ${formatDateTime(todo.updated_at)}`}</div>
              )}
              <div
                className={todo.updated_at !== todo.created_at ? "mt-0.5" : ""}
              >
                {`Created: ${formatDateTime(todo.created_at)}`}
              </div>
            </div>
          )}
          {mode === "edit" && (
            <div>
              <ActionButton
                onClick={() => {}}
                disabled={true}
                variant="delete"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
