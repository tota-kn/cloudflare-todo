import { useNavigate } from "react-router";
import { createServerFetcher } from "~/client";
import { TodoEditor } from "~/components/TodoEditor";
import { useTheme } from '~/contexts/ThemeContext';
import { useToggleTodo, useUpdateTodo } from "~/hooks/useTodos";
import type { Route } from "./+types/$id";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Edit Todo ${params.id}` },
    { name: "description", content: "Edit todo item" },
  ];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const todoId = params.id;
  
  if (!todoId) {
    throw new Error("Todo ID is required");
  }

  const req = await client.v1.todos[":todoId"].$get({ param: { todoId } });
  const res = await req.json();

  if ('error' in res) {
    throw new Error(res.error);
  }

  return {
    todo: res,
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  };
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const todoId = params.id;
  
  if (!todoId) {
    throw new Error("Todo ID is required");
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const req = await client.v1.todos[":todoId"].$put({
    param: { todoId },
    json: { title, description: description || undefined }
  });
  
  const res = await req.json();

  if ('error' in res) {
    throw new Error(res.error);
  }

  return { todo: res };
}

export default function TodoEdit({ loaderData }: Route.ComponentProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const updateTodo = useUpdateTodo();
  const toggleTodo = useToggleTodo();

  const handleSave = (title: string, description?: string) => {
    updateTodo.mutate(
      { todoId: loaderData.todo.id, title, description },
      { 
        onSuccess: () => {
          navigate("/todos");
        }
      }
    );
  };

  const handleCancel = () => {
    navigate("/todos");
  };

  const handleToggleComplete = () => {
    toggleTodo.mutate({ todoId: loaderData.todo.id, completed: loaderData.todo.completed });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Todo</h1>
        <button
          onClick={() => navigate("/todos")}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <TodoEditor
          mode="edit"
          initialTitle={loaderData.todo.title}
          initialDescription={loaderData.todo.description || ""}
          todo={loaderData.todo}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleComplete={handleToggleComplete}
          isSaving={updateTodo.isPending}
          isToggling={toggleTodo.isPending}
          showTimestamps={true}
        />
      </div>
    </div>
  );
}