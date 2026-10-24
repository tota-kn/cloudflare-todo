import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router"
import { describe, expect, it, vi } from "vite-plus/test"
import { TodoItem } from "~/components/TodoItem"
import { OPTIMISTIC_TODO_ID_PREFIX } from "~/hooks/useTodos"
import type { TodoDto } from "~/types/shared"

const navigate = vi.fn()

// React Routerのモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

// hooksのモック
vi.mock("~/hooks/useTodos", async (importOriginal) => ({
  ...(await importOriginal<typeof import("~/hooks/useTodos")>()),
  useDeleteTodo: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useToggleTodo: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

/**
 * テスト用のQueryClientを作成するヘルパー関数
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

/**
 * テスト用のTodoItemデータ
 */
const mockTodoItem: TodoDto = {
  id: "1",
  title: "Test Todo",
  description: "Test Description",
  completed: false,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
}

/**
 * TodoItemコンポーネントのテスト
 */
describe("TodoItem", () => {
  it("正常にレンダリングされること", () => {
    const queryClient = createTestQueryClient()

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TodoItem todo={mockTodoItem} />
        </BrowserRouter>
      </QueryClientProvider>
    )

    // コンポーネントが正常にレンダリングされることを確認
    expect(container).toBeTruthy()
  })

  it("保存済みのTodoをクリックすると編集画面へ遷移する", async () => {
    navigate.mockClear()
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <TodoItem todo={mockTodoItem} />
        </BrowserRouter>
      </QueryClientProvider>
    )

    fireEvent.click(await screen.findByText("Test Todo"))

    expect(navigate).toHaveBeenCalledWith("/en/todos/1")
  })

  it("保存中のTodoは操作できない（遷移せず、ボタンも無効）", async () => {
    navigate.mockClear()
    const savingTodo = { ...mockTodoItem, id: `${OPTIMISTIC_TODO_ID_PREFIX}1` }
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <TodoItem todo={savingTodo} />
        </BrowserRouter>
      </QueryClientProvider>
    )

    fireEvent.click(await screen.findByText("Test Todo"))

    expect(navigate).not.toHaveBeenCalled()
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveProperty("disabled", true)
    }
  })
})
