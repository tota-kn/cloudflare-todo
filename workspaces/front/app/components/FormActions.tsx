import { useTranslation } from "~/i18n/client"

/**
 * FormActionsコンポーネントのProps
 */
interface FormActionsProps {
  onCancel: () => void
  onSave: () => void
  canSave: boolean
  isSaving: boolean
}

/**
 * フォーム下部のキャンセル・保存ボタン。保存中や保存できない入力のときは保存を押せない
 * @param props コンポーネントのProps
 * @returns FormActionsコンポーネント
 */
export function FormActions({
  onCancel,
  onSave,
  canSave,
  isSaving,
}: FormActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      >
        {t("Cancel")}
      </button>
      <button
        onClick={onSave}
        disabled={!canSave || isSaving}
        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? t("Saving...") : t("Save")}
      </button>
    </div>
  )
}
