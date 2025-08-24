import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, expect, it, vi } from "vitest"
import { TodoItem } from "~/components/TodoItem"
import type { TodoItem as TodoItemData } from "../../../shared/client"

// React Routerのモック
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

// hooksのモック
vi.mock("~/hooks/useTodos", () => ({
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
const mockTodoItem: TodoItemData = {
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
})
