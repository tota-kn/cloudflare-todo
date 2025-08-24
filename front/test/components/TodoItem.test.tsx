import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { TodoItem } from "~/components/TodoItem"
import type { TodoItem as TodoItemData } from "~/../../shared/client"

// react-routerのモック
const mockNavigate = vi.fn()
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}))

// useTodosフックのモック
const mockDeleteTodo = {
  mutate: vi.fn(),
  isPending: false,
}

const mockToggleTodo = {
  mutate: vi.fn(),
  isPending: false,
}

vi.mock("~/hooks/useTodos", () => ({
  useDeleteTodo: () => mockDeleteTodo,
  useToggleTodo: () => mockToggleTodo,
}))

// formatDateTimeのモック
vi.mock("~/utils/dateFormat", () => ({
  formatDateTime: vi.fn((date: string) => `formatted-${date}`),
}))

// window.confirmのモック
const mockConfirm = vi.fn()
Object.defineProperty(window, "confirm", { value: mockConfirm })

/**
 * TodoItemコンポーネントのテスト
 * t-wada氏のテスト設計原則に基づく包括的テスト
 */
describe("TodoItem", () => {
  let queryClient: QueryClient

  const createMockTodo = (overrides?: Partial<TodoItemData>): TodoItemData => ({
    id: "test-id-1",
    title: "テストTodo",
    description: "テスト説明",
    completed: false,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    ...overrides,
  })

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
  })

  describe("正常系テスト", () => {
    it("未完了のTodoが正しくレンダリングされること", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText("テストTodo")).toBeInTheDocument()
      expect(screen.getByText("テスト説明")).toBeInTheDocument()
      expect(
        screen.getByText("formatted-2024-01-01T00:00:00.000Z")
      ).toBeInTheDocument()
    })

    it("完了済みのTodoが正しくレンダリングされること", () => {
      const todo = createMockTodo({ completed: true })
      renderWithQueryClient(<TodoItem todo={todo} />)

      const titleElement = screen.getByText("テストTodo")
      expect(titleElement).toHaveClass("line-through", "text-muted-foreground")
    })

    it("説明がない場合、説明が表示されないこと", () => {
      const todo = createMockTodo({ description: "" })
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText("テストTodo")).toBeInTheDocument()
      expect(screen.queryByText("テスト説明")).not.toBeInTheDocument()
    })

    it("更新日時が作成日時と異なる場合、両方表示されること", () => {
      const todo = createMockTodo({
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-02T00:00:00.000Z",
      })
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText(/Updated:/)).toBeInTheDocument()
      expect(screen.getByText(/Created:/)).toBeInTheDocument()
    })

    it("更新日時が作成日時と同じ場合、作成日時のみ表示されること", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.queryByText(/Updated:/)).not.toBeInTheDocument()
      expect(screen.getByText(/Created:/)).toBeInTheDocument()
    })
  })

  describe("操作テスト - 完了切り替え", () => {
    it("未完了Todoの完了ボタンをクリックすると toggleTodo が呼ばれること", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const toggleButton = screen.getByRole("button", { name: /toggle/i })
      fireEvent.click(toggleButton)

      expect(mockToggleTodo.mutate).toHaveBeenCalledWith({
        todoId: "test-id-1",
        completed: false,
      })
    })

    it("完了済みTodoの未完了ボタンをクリックすると toggleTodo が呼ばれること", () => {
      const todo = createMockTodo({ completed: true })
      renderWithQueryClient(<TodoItem todo={todo} />)

      const toggleButton = screen.getByRole("button", { name: /toggle/i })
      fireEvent.click(toggleButton)

      expect(mockToggleTodo.mutate).toHaveBeenCalledWith({
        todoId: "test-id-1",
        completed: true,
      })
    })

    it("toggle処理中はボタンが無効化されること", () => {
      mockToggleTodo.isPending = true
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const toggleButton = screen.getByRole("button", { name: /toggle/i })
      expect(toggleButton).toBeDisabled()
    })
  })

  describe("操作テスト - 削除", () => {
    it("削除ボタンをクリックして確認すると deleteTodo が呼ばれること", () => {
      mockConfirm.mockReturnValue(true)
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(mockConfirm).toHaveBeenCalledWith(
        "Are you sure you want to delete this todo?"
      )
      expect(mockDeleteTodo.mutate).toHaveBeenCalledWith("test-id-1")
    })

    it("削除ボタンをクリックしてキャンセルすると deleteTodo が呼ばれないこと", () => {
      mockConfirm.mockReturnValue(false)
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(mockConfirm).toHaveBeenCalled()
      expect(mockDeleteTodo.mutate).not.toHaveBeenCalled()
    })

    it("delete処理中はボタンが無効化されること", () => {
      mockDeleteTodo.isPending = true
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      expect(deleteButton).toBeDisabled()
    })
  })

  describe("操作テスト - 編集", () => {
    it("Todo項目をクリックすると編集画面に遷移すること", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const todoItem = screen.getByTitle("Click to edit")
      fireEvent.click(todoItem)

      expect(mockNavigate).toHaveBeenCalledWith("/todos/test-id-1")
    })

    it("完了ボタンクリック時は編集画面に遷移しないこと", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const toggleButton = screen.getByRole("button", { name: /toggle/i })
      fireEvent.click(toggleButton)

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("削除ボタンクリック時は編集画面に遷移しないこと", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const deleteButton = screen.getByRole("button", { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe("境界値テスト", () => {
    it("最小限の必須フィールドのみのTodoが正しく表示されること", () => {
      const todo: TodoItemData = {
        id: "min-id",
        title: "最小Todo",
        description: "",
        completed: false,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
      }
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText("最小Todo")).toBeInTheDocument()
      expect(screen.queryByText("")).not.toBeInTheDocument()
    })

    it("長いタイトルが正しく表示されること", () => {
      const longTitle = "a".repeat(1000)
      const todo = createMockTodo({ title: longTitle })
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it("長い説明が正しく表示されること", () => {
      const longDescription = "b".repeat(5000)
      const todo = createMockTodo({ description: longDescription })
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it("特殊文字を含むタイトルが正しく表示されること", () => {
      const specialTitle = "!@#$%^&*()[]{}|;':\",./<>?"
      const todo = createMockTodo({ title: specialTitle })
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })
  })

  describe("スタイリングテスト", () => {
    it("未完了Todoが適切なスタイルクラスを持つこと", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const container = screen.getByTitle("Click to edit")
      expect(container).toHaveClass("bg-card", "border-border")

      const titleElement = screen.getByText("テストTodo")
      expect(titleElement).toHaveClass("text-card-foreground")
      expect(titleElement).not.toHaveClass("line-through")
    })

    it("完了済みTodoが適切なスタイルクラスを持つこと", () => {
      const todo = createMockTodo({ completed: true })
      renderWithQueryClient(<TodoItem todo={todo} />)

      const container = screen.getByTitle("Click to edit")
      expect(container).toHaveClass("bg-muted", "border-border")

      const titleElement = screen.getByText("テストTodo")
      expect(titleElement).toHaveClass("line-through", "text-muted-foreground")
    })
  })

  describe("アクセシビリティテスト", () => {
    it("編集用クリック領域に適切なタイトル属性が設定されていること", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      const clickableArea = screen.getByTitle("Click to edit")
      expect(clickableArea).toBeInTheDocument()
    })

    it("ボタンが適切なrole属性を持つこと", () => {
      const todo = createMockTodo()
      renderWithQueryClient(<TodoItem todo={todo} />)

      expect(
        screen.getByRole("button", { name: /toggle/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /delete/i })
      ).toBeInTheDocument()
    })
  })
})
