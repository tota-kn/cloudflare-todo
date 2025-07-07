import { useState } from "react";
import { createServerFetcher } from "~/client";
import { ErrorMessage } from "~/components/ErrorMessage";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { TodoForm } from "~/components/TodoForm";
import { TodoList } from "~/components/TodoList";
import { useTodos } from "~/hooks/useTodos";
import type { TodoItem } from "../../../shared/client";
import type { Route } from "./+types/todos";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo List" },
    { name: "description", content: "Todo list page" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const req = await client.v1.todos.$get();
  const res = await req.json();

  if ('error' in res) {
    throw new Error(res.error);
  }

  return {
    todos: res.todos,
  };
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  
  const { data: todos, isLoading, error } = useTodos(loaderData.todos);
  
  const currentTodos = todos || [];

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Todo List</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300"
        >
          {showForm ? 'Cancel' : 'Add Todo'}
        </button>
      </div>

      {showForm && (
        <TodoForm 
          editingTodo={editingTodo} 
          onCancel={handleCancelEdit} 
        />
      )}
      
      {isLoading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error.message} />}
      
      {!isLoading && (
        <TodoList 
          todos={currentTodos} 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
}