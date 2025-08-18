import { useState } from "react";
import { createServerFetcher } from "~/client";
import { ErrorMessage } from "~/components/ErrorMessage";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { ThemeToggle } from "~/components/ThemeToggle";
import { TodoList } from "~/components/TodoList";
import { useTodos } from "~/hooks/useTodos";
import { PlusIcon, XIcon } from "~/components/ui/Icon";
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
    todos: res.items,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  };
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const [showNewTodoForm, setShowNewTodoForm] = useState(false);
  
  const { data: todos, isLoading, error } = useTodos(loaderData.todos);
  
  const currentTodos = todos || [];

  const handleCancelNewTodo = () => {
    setShowNewTodoForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
          <img 
            src={`${loaderData.apiBaseUrl}/v1/assets/test.png`}
            alt="Test"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setShowNewTodoForm(!showNewTodoForm)}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
            title={showNewTodoForm ? 'Cancel' : 'Add Todo'}
          >
{showNewTodoForm ? <XIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>


      {isLoading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error.message} />}
      
      {!isLoading && (
        <TodoList 
          todos={currentTodos}
          showNewTodoForm={showNewTodoForm}
          onCancelNewTodo={handleCancelNewTodo}
        />
      )}
    </div>
  );
}