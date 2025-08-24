import React from "react"
import { renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { useTodos } from "~/hooks/useTodos"

// clientのモック
vi.mock("~/client", () => ({
  createBrowserClient: vi.fn(() => ({
    v1: {
      todos: {
        $get: vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ items: [] }),
        }),
      },
    },
  })),
}))

describe("useTodos", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const createWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)

  it("useTodosフックが正常に動作すること", () => {
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper,
    })

    expect(result.current).toBeDefined()
  })
})
