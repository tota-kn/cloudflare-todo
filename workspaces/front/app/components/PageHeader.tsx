import { useNavigate } from "react-router"
import { ActionButton } from "~/components/CircleButton"
import { useTheme } from "~/contexts/ThemeContext"

interface PageHeaderProps {
  title: string
  logoUrl: string
  showNewTodoButton?: boolean
  showBackButton?: boolean
}

export function PageHeader({
  title,
  logoUrl,
  showNewTodoButton = false,
  showBackButton = false,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Test" className="h-12 object-contain" />
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ActionButton
          onClick={toggleTheme}
          variant={theme === "light" ? "theme-light" : "theme-dark"}
        />
        {showNewTodoButton && (
          <div className="p-1">
            <ActionButton
              onClick={() => navigate("/todos/new")}
              variant="add-cancel"
              showCancel={false}
            />
          </div>
        )}
        {showBackButton && (
          <button
            onClick={() => navigate("/todos")}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>
    </div>
  )
}
