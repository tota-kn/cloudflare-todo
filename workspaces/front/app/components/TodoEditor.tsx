import { useEffect, useState } from "react"
import { formatDateTime } from "~/utils/dateFormat"
import type { TodoDto } from "../types/shared"
import { ActionButton } from "./CircleButton"
import { TodoInput } from "./TodoInput"
import { useTranslation } from "~/i18n/client"

interface TodoEditorProps {
  mode: "create" | "edit"
  initialTitle?: string
  initialDescription?: string
  todo?: TodoDto
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
  const { t } = useTranslation()
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
      <div className="flex items-center">
        {mode === "edit" && (
          <div className="mr-3 shrink-0">
            <ActionButton
              onClick={() => {}}
              variant={todo?.completed ? "toggle-pending" : "toggle-complete"}
              disabled={true}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
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

          {showTimestamps && todo && (
            <div className="text-xs text-muted-foreground mt-1">
              {todo.updated_at !== todo.created_at && (
                <div>{`${t("Updated")}: ${formatDateTime(todo.updated_at)}`}</div>
              )}
              <div>{`${t("Created")}: ${formatDateTime(todo.created_at)}`}</div>
            </div>
          )}
        </div>

        {mode === "edit" && (
          <div className="ml-3 shrink-0">
            <ActionButton
              onClick={() => {}}
              disabled={true}
              variant="delete"
            />
          </div>
        )}
      </div>
    </div>
  )
}
