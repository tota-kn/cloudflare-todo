import { useState } from "react";
import { createServerFetcher } from "~/client";
import { ErrorMessage } from "~/components/ErrorMessage";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { TodoForm } from "~/components/TodoForm";
import { TodoList } from "~/components/TodoList";
import { ThemeToggle } from "~/components/ThemeToggle";
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
        <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
            title={showForm ? 'Cancel' : 'Add Todo'}
          >
            {showForm ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
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