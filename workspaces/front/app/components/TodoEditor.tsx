import { useState } from "react"
import type { TodoDto } from "../types/shared"
import { ActionButton } from "./CircleButton"
import { TodoInput } from "./TodoInput"
import { TodoTimestamps } from "./TodoTimestamps"

/**
 * TodoEditorコンポーネントのProps
 */
interface TodoEditorProps {
  mode: "create" | "edit"
  initialTitle?: string
  initialDescription?: string
  todo?: TodoDto
  onSave: (title: string, description?: string) => void
  onCancel?: () => void
  isSaving?: boolean
  showTimestamps?: boolean
}

/**
 * 編集カードの背景。作成中は出現アニメーションを付け、完了済みは沈んだ色にする
 * @param mode 作成か編集か
 * @param completed 編集中のTodoが完了済みか
 * @returns カードのクラス
 */
const cardClass = (mode: TodoEditorProps["mode"], completed?: boolean) => {
  if (mode === "create") {
    return "bg-card border-border animate-in slide-in-from-top-1 duration-200"
  }
  return completed ? "bg-muted border-border" : "bg-card border-border"
}

/**
 * Enter で保存、Escape でキャンセルするキー操作ハンドラを作る
 * @param actions.canSubmit Enter で保存してよいか
 * @param actions.save 保存処理
 * @param actions.cancel キャンセル処理
 * @returns keydown ハンドラ
 */
const editorKeyDown =
  (actions: {
    canSubmit: (e: React.KeyboardEvent) => boolean
    save: () => void
    cancel: () => void
  }) =>
  (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && actions.canSubmit(e)) {
      e.preventDefault()
      actions.save()
    } else if (e.key === "Escape") {
      actions.cancel()
    }
  }

/**
 * 入力中のタイトル・説明と、その変更・保存・キャンセルのハンドラをまとめる
 * @param props TodoEditorのProps
 * @returns 入力値と TodoInput に渡すハンドラ
 */
const useTodoDraft = ({
  initialTitle = "",
  initialDescription = "",
  onSave,
  onCancel,
}: TodoEditorProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const canSave = title.length > 0

  const save = () => {
    if (canSave) onSave(title, description || undefined)
  }
  const cancel = () => {
    setTitle(initialTitle)
    setDescription(initialDescription)
    onCancel?.()
  }

  return {
    title,
    description,
    onTitleChange: (newTitle: string) => {
      setTitle(newTitle)
      onSave(newTitle, description || undefined)
    },
    onDescriptionChange: (newDescription: string) => {
      setDescription(newDescription)
      onSave(title, newDescription || undefined)
    },
    onTitleKeyDown: editorKeyDown({ canSubmit: () => canSave, save, cancel }),
    // 説明欄は Shift+Enter で改行したいので、Shift なしの Enter だけで保存する
    onDescriptionKeyDown: editorKeyDown({
      canSubmit: (e) => !e.shiftKey && canSave,
      save,
      cancel,
    }),
  }
}

/**
 * Todoの作成・編集フォーム。入力のたびに onSave を呼ぶ
 * @param props コンポーネントのProps
 * @returns TodoEditorコンポーネント
 */
export function TodoEditor(props: TodoEditorProps) {
  const { mode, todo, showTimestamps = false } = props
  const draft = useTodoDraft(props)

  return (
    <div
      className={`border rounded-lg py-2 px-4 ${cardClass(mode, todo?.completed)}`}
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
            {...draft}
            autoFocusTitle={true}
            showHelpText={mode === "create"}
            mode={mode}
          />

          {showTimestamps && todo && <TodoTimestamps todo={todo} />}
        </div>

        {mode === "edit" && (
          <div className="ml-3 shrink-0">
            <ActionButton onClick={() => {}} disabled={true} variant="delete" />
          </div>
        )}
      </div>
    </div>
  )
}
