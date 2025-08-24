import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import { TodoInput } from "~/components/TodoInput"

/**
 * TodoInputコンポーネントのテスト
 * t-wada氏のテスト設計原則に基づく包括的テスト
 */
describe("TodoInput", () => {
  const defaultProps = {
    title: "",
    description: "",
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("正常系テスト", () => {
    it("正常にレンダリングされること", () => {
      render(<TodoInput {...defaultProps} />)

      expect(screen.getByPlaceholderText("Todo title...")).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText("Add description...")
      ).toBeInTheDocument()
    })

    it("初期値が正しく表示されること", () => {
      render(
        <TodoInput
          {...defaultProps}
          title="テストタイトル"
          description="テスト説明"
        />
      )

      expect(screen.getByDisplayValue("テストタイトル")).toBeInTheDocument()
      expect(screen.getByDisplayValue("テスト説明")).toBeInTheDocument()
    })

    it("カスタムプレースホルダーが表示されること", () => {
      render(
        <TodoInput
          {...defaultProps}
          titlePlaceholder="カスタムタイトル"
          descriptionPlaceholder="カスタム説明"
        />
      )

      expect(
        screen.getByPlaceholderText("カスタムタイトル")
      ).toBeInTheDocument()
      expect(screen.getByPlaceholderText("カスタム説明")).toBeInTheDocument()
    })
  })

  describe("入力操作テスト", () => {
    it("タイトル入力で onTitleChange が呼ばれること", () => {
      const onTitleChange = vi.fn()
      render(<TodoInput {...defaultProps} onTitleChange={onTitleChange} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      fireEvent.change(titleInput, { target: { value: "新しいタイトル" } })

      expect(onTitleChange).toHaveBeenCalledWith("新しいタイトル")
    })

    it("説明入力で onDescriptionChange が呼ばれること", () => {
      const onDescriptionChange = vi.fn()
      render(
        <TodoInput
          {...defaultProps}
          onDescriptionChange={onDescriptionChange}
        />
      )

      const descriptionInput = screen.getByPlaceholderText("Add description...")
      fireEvent.change(descriptionInput, {
        target: { value: "新しい説明" },
      })

      expect(onDescriptionChange).toHaveBeenCalledWith("新しい説明")
    })
  })

  describe("境界値テスト", () => {
    it("空文字列入力が正しく処理されること", () => {
      const onTitleChange = vi.fn()
      const onDescriptionChange = vi.fn()
      render(
        <TodoInput
          {...defaultProps}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
        />
      )

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      fireEvent.change(titleInput, { target: { value: "" } })
      fireEvent.change(descriptionInput, { target: { value: "" } })

      expect(onTitleChange).toHaveBeenCalledWith("")
      expect(onDescriptionChange).toHaveBeenCalledWith("")
    })

    it("長文入力が正しく処理されること", () => {
      const onTitleChange = vi.fn()
      const onDescriptionChange = vi.fn()
      const longTitle = "a".repeat(1000)
      const longDescription = "b".repeat(5000)

      render(
        <TodoInput
          {...defaultProps}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
        />
      )

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      fireEvent.change(titleInput, { target: { value: longTitle } })
      fireEvent.change(descriptionInput, { target: { value: longDescription } })

      expect(onTitleChange).toHaveBeenCalledWith(longTitle)
      expect(onDescriptionChange).toHaveBeenCalledWith(longDescription)
    })

    it("特殊文字入力が正しく処理されること", () => {
      const onTitleChange = vi.fn()
      const specialChars = "!@#$%^&*()[]{}|;':\",./<>?"

      render(<TodoInput {...defaultProps} onTitleChange={onTitleChange} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      fireEvent.change(titleInput, { target: { value: specialChars } })

      expect(onTitleChange).toHaveBeenCalledWith(specialChars)
    })
  })

  describe("キーボード操作テスト", () => {
    it("タイトルでTabキーを押すと説明フィールドにフォーカスが移ること", () => {
      render(<TodoInput {...defaultProps} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      titleInput.focus()
      fireEvent.keyDown(titleInput, { key: "Tab", shiftKey: false })

      expect(descriptionInput).toHaveFocus()
    })

    it("説明でShift+Tabキーを押すとタイトルフィールドにフォーカスが移ること", () => {
      render(<TodoInput {...defaultProps} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      descriptionInput.focus()
      fireEvent.keyDown(descriptionInput, { key: "Tab", shiftKey: true })

      expect(titleInput).toHaveFocus()
    })

    it("カスタムキーイベントハンドラーが正しく呼ばれること", () => {
      const onTitleKeyDown = vi.fn()
      const onDescriptionKeyDown = vi.fn()

      render(
        <TodoInput
          {...defaultProps}
          onTitleKeyDown={onTitleKeyDown}
          onDescriptionKeyDown={onDescriptionKeyDown}
        />
      )

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      fireEvent.keyDown(titleInput, { key: "Enter" })
      fireEvent.keyDown(descriptionInput, { key: "Escape" })

      expect(onTitleKeyDown).toHaveBeenCalled()
      expect(onDescriptionKeyDown).toHaveBeenCalled()
    })
  })

  describe("フォーカス制御テスト", () => {
    it("autoFocusTitle が true の場合、タイトルフィールドにフォーカスされること", () => {
      render(<TodoInput {...defaultProps} autoFocusTitle={true} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      expect(titleInput).toHaveFocus()
    })

    it("autoFocusTitle が false の場合、フォーカスされないこと", () => {
      render(<TodoInput {...defaultProps} autoFocusTitle={false} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      expect(titleInput).not.toHaveFocus()
    })
  })

  describe("データ属性テスト", () => {
    it("適切なdata属性が設定されていること", () => {
      render(<TodoInput {...defaultProps} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      const descriptionInput = screen.getByPlaceholderText("Add description...")

      expect(titleInput).toHaveAttribute("data-todo-title")
      expect(descriptionInput).toHaveAttribute("data-todo-description")
    })
  })

  describe("アクセシビリティテスト", () => {
    it("input要素が適切なtype属性を持つこと", () => {
      render(<TodoInput {...defaultProps} />)

      const titleInput = screen.getByPlaceholderText("Todo title...")
      expect(titleInput).toHaveAttribute("type", "text")
    })

    it("textarea要素が適切なrows属性を持つこと", () => {
      render(<TodoInput {...defaultProps} />)

      const descriptionInput = screen.getByPlaceholderText("Add description...")
      expect(descriptionInput).toHaveAttribute("rows", "1")
    })
  })
})
