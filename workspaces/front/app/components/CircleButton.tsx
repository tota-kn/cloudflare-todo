import type { ReactNode } from "react"
import {
  CheckIcon,
  DeleteIcon,
  MoonIcon,
  PlusIcon,
  ResetIcon,
  SaveIcon,
  SunIcon,
  XIcon,
} from "./CustomIcon"

type Variant =
  | "save"
  | "cancel"
  | "delete"
  | "toggle-complete"
  | "toggle-pending"
  | "theme-light"
  | "theme-dark"
  | "add"
  | "add-cancel"

/**
 * ActionButtonコンポーネントのProps
 */
interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  variant: Variant
  isLoading?: boolean
  title?: string
  showCancel?: boolean
}

const PRIMARY = "bg-primary text-primary-foreground hover:bg-primary/90"
const SECONDARY = "bg-secondary text-secondary-foreground hover:bg-secondary/80"

/**
 * バリアントごとの見た目・アイコン・ツールチップ
 * loadingTitle が無いバリアントは処理中に "Loading..." を出す
 */
const VARIANTS: Record<
  Variant,
  { style: string; icon: ReactNode; title: string; loadingTitle?: string }
> = {
  save: {
    style: PRIMARY,
    icon: <SaveIcon />,
    title: "Save",
    loadingTitle: "Saving...",
  },
  cancel: { style: SECONDARY, icon: <XIcon />, title: "Cancel" },
  delete: {
    style: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    icon: <DeleteIcon />,
    title: "Delete",
    loadingTitle: "Deleting...",
  },
  "toggle-complete": {
    style: PRIMARY,
    icon: <CheckIcon />,
    title: "Mark Complete",
    loadingTitle: "Updating...",
  },
  "toggle-pending": {
    style: PRIMARY,
    icon: <ResetIcon />,
    title: "Mark Pending",
    loadingTitle: "Updating...",
  },
  "theme-light": {
    style: SECONDARY,
    icon: <MoonIcon />,
    title: "Switch to dark mode",
  },
  "theme-dark": {
    style: SECONDARY,
    icon: <SunIcon />,
    title: "Switch to light mode",
  },
  add: { style: PRIMARY, icon: <PlusIcon />, title: "Add Todo" },
  "add-cancel": { style: PRIMARY, icon: <PlusIcon />, title: "Add Todo" },
}

/**
 * 表示中のバリアントの設定を引く。add-cancel は開いている間 cancel として振る舞う
 * @param variant ボタンのバリアント
 * @param showCancel add-cancel がキャンセル表示中か
 * @returns 表示に使うバリアント設定
 */
const resolveVariant = (variant: Variant, showCancel: boolean) =>
  variant === "add-cancel" && showCancel ? VARIANTS.cancel : VARIANTS[variant]

/**
 * 円形のアクションボタンコンポーネント
 * 様々なバリアントとローディング状態をサポート
 * @param props コンポーネントのProps
 * @returns ActionButtonコンポーネント
 */
export function ActionButton(props: ActionButtonProps) {
  const { onClick, variant, title } = props
  const isLoading = props.isLoading ?? false
  const inactive = (props.disabled ?? false) || isLoading
  const config = resolveVariant(variant, props.showCancel ?? false)
  const style = inactive
    ? "bg-muted text-muted-foreground cursor-not-allowed"
    : VARIANTS[variant].style
  const defaultTitle = isLoading
    ? (config.loadingTitle ?? "Loading...")
    : config.title

  return (
    <button
      onClick={onClick}
      disabled={inactive}
      className={`p-2 rounded-full transition-colors ${style}`}
      title={title || defaultTitle}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        config.icon
      )}
    </button>
  )
}
