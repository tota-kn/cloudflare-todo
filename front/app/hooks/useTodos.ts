import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType } from "hono"
import { createBrowserClient } from "~/client"
import type { TodoDto } from "../types/shared"

type CreateTodoRequest = InferRequestType<typeof client.v1.todos.$post>["json"]

type UpdateTodoRequest = InferRequestType<
  (typeof client.v1.todos)[":todoId"]["$put"]
>["json"]

const client = createBrowserClient()

/**
 * Todo一覧を取得するカスタムフック
 * @param initialData 初期データ（オプション）
 * @returns Todo一覧のクエリ結果
 */
export const useTodos = (initialData?: TodoDto[]) => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await client.v1.todos.$get()
      const data = await res.json()

      if ("error" in data) {
        throw new Error(data.error)
      }

      return data.items
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間はキャッシュを保持
  })
}

/**
 * Todo作成のカスタムフック
 * @returns Todo作成のミューテーション
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTodo: CreateTodoRequest) => {
      const res = await client.v1.todos.$post({
        json: newTodo,
      })

      if (!res.ok) {
        throw new Error("Failed to create todo")
      }

      const data = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<TodoDto[]>(["todos"])

      const optimisticTodo: TodoDto = {
        id: `temp-${Date.now()}`,
        title: newTodo.title,
        description: newTodo.description ?? "",
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      queryClient.setQueryData<TodoDto[]>(["todos"], (old) =>
        old ? [...old, optimisticTodo] : [optimisticTodo]
      )

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos)
    },
  })
}

/**
 * Todo更新のカスタムフック
 * @returns Todo更新のミューテーション
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      todoId,
      ...updates
    }: UpdateTodoRequest & { todoId: string }) => {
      const res = await client.v1.todos[":todoId"].$put({
        param: { todoId },
        json: updates,
      })

      if (!res.ok) {
        throw new Error("Failed to update todo")
      }

      const data = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onMutate: async ({ todoId, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<TodoDto[]>(["todos"])

      queryClient.setQueryData<TodoDto[]>(
        ["todos"],
        (old) =>
          old?.map((todo) =>
            todo.id === todoId
              ? { ...todo, ...updates, updated_at: new Date().toISOString() }
              : todo
          ) || []
      )

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos)
    },
  })
}

/**
 * Todo削除のカスタムフック
 * @returns Todo削除のミューテーション
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoId: string) => {
      const res = await client.v1.todos[":todoId"].$delete({
        param: { todoId },
      })

      if (!res.ok) {
        throw new Error("Failed to delete todo")
      }

      const data = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<TodoDto[]>(["todos"])

      queryClient.setQueryData<TodoDto[]>(
        ["todos"],
        (old) => old?.filter((todo) => todo.id !== todoId) || []
      )

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos)
    },
  })
}

/**
 * Todoのステータス切り替えのカスタムフック
 * @returns Todoステータス切り替えのミューテーション
 */
export const useToggleTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      todoId,
      completed,
    }: {
      todoId: string
      completed: boolean
    }) => {
      const res = await client.v1.todos[":todoId"].$put({
        param: { todoId },
        json: { completed: !completed },
      })

      if (!res.ok) {
        throw new Error("Failed to toggle todo")
      }

      const data = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onMutate: async ({ todoId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<TodoDto[]>(["todos"])

      queryClient.setQueryData<TodoDto[]>(
        ["todos"],
        (old) =>
          old?.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  completed: !completed,
                  updated_at: new Date().toISOString(),
                }
              : todo
          ) || []
      )

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos)
    },
  })
}
