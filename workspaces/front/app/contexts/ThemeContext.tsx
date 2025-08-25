import { createContext, useContext, useEffect, useState } from "react"

/**
 * テーマの種類（ライト・ダーク）
 */
type Theme = "light" | "dark"
/**
 * 指定された値がTheme型かどうかをチェックする型ガード関数
 */
function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark"
}

/**
 * テーマコンテキストの型定義
 */
interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * 初期テーマを取得する
 * ローカルストレージ、システム設定の順で優先度を決定
 * @returns 初期テーマ
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"
  }

  const savedTheme = localStorage.getItem("theme")
  if (isTheme(savedTheme)) {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/**
 * テーマプロバイダーコンポーネント
 * アプリケーション全体でテーマ状態を管理する
 * @param props コンポーネントのProps
 * @returns ThemeProviderコンポーネント
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    document.documentElement.setAttribute("data-theme", initialTheme)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme)
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * テーマコンテキストを使用するカスタムフック
 * @returns テーマコンテキストの値
 * @throws {Error} ThemeProvider外で使用された場合
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
