import { useTranslation } from "~/i18n/client"

/**
 * TodoInputコンポーネントのProps
 */
interface TodoInputProps {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onTitleKeyDown?: (e: React.KeyboardEvent) => void
  onDescriptionKeyDown?: (e: React.KeyboardEvent) => void
  titlePlaceholder?: string
  descriptionPlaceholder?: string
  autoFocusTitle?: boolean
  showHelpText?: boolean
  mode?: "create" | "edit"
}

/**
 * Todoのタイトルと説明の入力欄。値は親が持つ
 * @param props コンポーネントのProps
 * @returns TodoInputコンポーネント
 */
export function TodoInput({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onTitleKeyDown,
  onDescriptionKeyDown,
  titlePlaceholder,
  descriptionPlaceholder,
  autoFocusTitle = false,
}: TodoInputProps) {
  const { t } = useTranslation()

  return (
    <div className="flex-1">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={onTitleKeyDown}
        className="font-semibold bg-transparent border-b border-primary focus:outline-none focus:border-primary w-full text-base"
        placeholder={titlePlaceholder || t("Todo title...")}
        autoFocus={autoFocusTitle}
        data-todo-title
      />
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        onKeyDown={onDescriptionKeyDown}
        className="mt-1 text-sm bg-transparent focus:outline-none w-full resize-none border-b border-primary focus:border-primary pb-0 leading-tight"
        rows={1}
        placeholder={descriptionPlaceholder || t("Add description...")}
        data-todo-description
      />
    </div>
  )
}
