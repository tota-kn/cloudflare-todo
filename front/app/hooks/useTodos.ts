import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "~/client";
import type { CreateTodoRequest, TodoItem, UpdateTodoRequest } from "../../../shared/client";

const client = createBrowserClient();

export const useTodos = (initialData?: TodoItem[]) => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await client.v1.todos.$get();
      const data = await res.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      return data.todos;
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間はキャッシュを保持
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTodo: CreateTodoRequest) => {
      const res = await client.v1.todos.$post({
        json: newTodo,
      });
      
      if (!res.ok) {
        throw new Error('Failed to create todo');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      
      const previousTodos = queryClient.getQueryData<TodoItem[]>(["todos"]);
      
      const optimisticTodo: TodoItem = {
        id: `temp-${Date.now()}`,
        title: newTodo.title,
        description: newTodo.description || null,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      queryClient.setQueryData<TodoItem[]>(["todos"], (old) => 
        old ? [...old, optimisticTodo] : [optimisticTodo]
      );
      
      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTodoRequest & { id: string }) => {
      const res = await client.v1.todos[":id"].$put({
        param: { id },
        json: updates,
      });
      
      if (!res.ok) {
        throw new Error('Failed to update todo');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      
      const previousTodos = queryClient.getQueryData<TodoItem[]>(["todos"]);
      
      queryClient.setQueryData<TodoItem[]>(["todos"], (old) => 
        old?.map((todo) => 
          todo.id === id 
            ? { ...todo, ...updates, updated_at: new Date().toISOString() }
            : todo
        ) || []
      );
      
      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.v1.todos[":id"].$delete({
        param: { id },
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete todo');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      
      const previousTodos = queryClient.getQueryData<TodoItem[]>(["todos"]);
      
      queryClient.setQueryData<TodoItem[]>(["todos"], (old) => 
        old?.filter((todo) => todo.id !== id) || []
      );
      
      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await client.v1.todos[":id"].$put({
        param: { id },
        json: { completed: !completed },
      });
      
      if (!res.ok) {
        throw new Error('Failed to toggle todo');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      
      const previousTodos = queryClient.getQueryData<TodoItem[]>(["todos"]);
      
      queryClient.setQueryData<TodoItem[]>(["todos"], (old) => 
        old?.map((todo) => 
          todo.id === id 
            ? { ...todo, completed: !completed, updated_at: new Date().toISOString() }
            : todo
        ) || []
      );
      
      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
  });
};

export const useAttachments = (todoId: string) => {
  return useQuery({
    queryKey: ["attachments", todoId],
    queryFn: async () => {
      try {
        const res = await client.v1.todos[":id"].attachments.$get({
          param: { todoId },
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            return [];
          }
          throw new Error('Failed to fetch attachments');
        }
        
        const data = await res.json();
        
        if ('error' in data) {
          throw new Error(data.error);
        }
        
        return data.success ? data.data : [];
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          return [];
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('404') || error.message.includes('Failed to fetch attachments')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ todoId, file }: { todoId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await client.v1.todos[":todoId"].attachments.$post({
        param: { todoId },
        form: formData,
      });
      
      if (!res.ok) {
        throw new Error('Failed to upload attachment');
      }
      
      return res.json();
    },
    onSuccess: (_data, { todoId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", todoId] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ todoId, attachmentId }: { todoId: string; attachmentId: string }) => {
      const res = await client.v1.todos[":todoId"].attachments[":attachmentId"].$delete({
        param: { todoId, attachmentId },
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete attachment');
      }
      
      return res.json();
    },
    onSuccess: (_data, { todoId }) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", todoId] });
    },
  });
};