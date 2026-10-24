import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vite-plus/test"
import { ActionButton } from "~/components/CircleButton"

/**
 * ActionButtonコンポーネントのテスト
 */
describe("ActionButton", () => {
  it.each([
    ["save", "Save"],
    ["cancel", "Cancel"],
    ["delete", "Delete"],
    ["toggle-complete", "Mark Complete"],
    ["toggle-pending", "Mark Pending"],
    ["theme-light", "Switch to dark mode"],
    ["theme-dark", "Switch to light mode"],
    ["add", "Add Todo"],
    ["add-cancel", "Add Todo"],
  ] as const)("%s は「%s」と表示される", (variant, title) => {
    render(<ActionButton onClick={() => {}} variant={variant} />)

    expect(screen.getByRole("button").title).toBe(title)
  })

  it.each([
    ["save", "Saving..."],
    ["delete", "Deleting..."],
    ["toggle-complete", "Updating..."],
    ["toggle-pending", "Updating..."],
    ["add", "Loading..."],
  ] as const)("処理中の %s は「%s」と表示され押せない", (variant, title) => {
    render(<ActionButton onClick={() => {}} variant={variant} isLoading />)

    const button = screen.getByRole("button")
    expect(button.title).toBe(title)
    expect(button).toHaveProperty("disabled", true)
  })

  it("add-cancel は showCancel のとき Cancel になる", () => {
    render(<ActionButton onClick={() => {}} variant="add-cancel" showCancel />)

    expect(screen.getByRole("button").title).toBe("Cancel")
  })

  it("title を渡すと既定の表示より優先される", () => {
    render(
      <ActionButton
        onClick={() => {}}
        variant="save"
        title="Custom"
        isLoading
      />
    )

    expect(screen.getByRole("button").title).toBe("Custom")
  })

  it("無効なときは押せず、無効の見た目になる", () => {
    render(<ActionButton onClick={() => {}} variant="delete" disabled />)

    const button = screen.getByRole("button")
    expect(button).toHaveProperty("disabled", true)
    expect(button.className).toContain("cursor-not-allowed")
  })
})
