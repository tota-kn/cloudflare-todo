import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "~/client";

interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateTodoRequest {
  title: string;
  description?: string;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

const client = createBrowserClient();

export const useTodos = () => {
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
    onError: (err, newTodo, context) => {
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
    onError: (err, variables, context) => {
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
    onError: (err, id, context) => {
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
    onError: (err, variables, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
  });
};