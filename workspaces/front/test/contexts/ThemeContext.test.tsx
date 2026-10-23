import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"
import { ThemeProvider, useTheme } from "~/contexts/ThemeContext"

/**
 * テーマの表示と切り替えボタンだけを持つテスト用コンポーネント
 * @returns テスト用の要素
 */
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute("data-theme")
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false }))
    )
  })

  it("保存済みのテーマで始まる", () => {
    localStorage.setItem("theme", "dark")

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByRole("button").textContent).toBe("dark")
  })

  it("切り替えると data-theme と保存値が変わる", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    act(() => screen.getByRole("button").click())

    expect(screen.getByRole("button").textContent).toBe("dark")
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    expect(localStorage.getItem("theme")).toBe("dark")
  })
})
