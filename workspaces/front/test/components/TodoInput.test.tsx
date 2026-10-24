import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vite-plus/test"
import { TodoInput } from "~/components/TodoInput"

/**
 * TodoInputコンポーネントのテスト
 */
describe("TodoInput", () => {
  it("autoFocusTitle のときタイトル欄にフォーカスが当たる", async () => {
    render(
      <TodoInput
        title=""
        description=""
        onTitleChange={() => {}}
        onDescriptionChange={() => {}}
        autoFocusTitle
      />
    )

    const title = await screen.findByPlaceholderText("Todo title...")
    await waitFor(() => expect(document.activeElement).toBe(title))
  })

  it("入力とキー操作を親に渡す", async () => {
    const handlers = {
      onTitleChange: vi.fn(),
      onDescriptionChange: vi.fn(),
      onTitleKeyDown: vi.fn(),
      onDescriptionKeyDown: vi.fn(),
    }
    render(<TodoInput title="" description="" {...handlers} />)
    const title = await screen.findByPlaceholderText("Todo title...")
    const description = screen.getByPlaceholderText("Add description...")

    fireEvent.change(title, { target: { value: "a" } })
    fireEvent.change(description, { target: { value: "b" } })
    fireEvent.keyDown(title, { key: "Enter" })
    fireEvent.keyDown(description, { key: "Escape" })

    expect(handlers.onTitleChange).toHaveBeenCalledWith("a")
    expect(handlers.onDescriptionChange).toHaveBeenCalledWith("b")
    expect(handlers.onTitleKeyDown).toHaveBeenCalled()
    expect(handlers.onDescriptionKeyDown).toHaveBeenCalled()
  })
})
