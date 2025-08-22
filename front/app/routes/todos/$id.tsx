import { useState } from "react";
import { useNavigate } from "react-router";
import { createServerFetcher } from "~/client";
import { TodoEditor } from "~/components/TodoEditor";
import { useUpdateTodo } from "~/hooks/useTodos";
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
  const navigate = useNavigate();
  const updateTodo = useUpdateTodo();
  const [title, setTitle] = useState(loaderData.todo.title);
  const [description, setDescription] = useState(loaderData.todo.description || "");

  const handleSave = () => {
    if (title.length > 0) {
      updateTodo.mutate(
        { todoId: loaderData.todo.id, title, description },
        {
          onSuccess: () => {
            navigate("/todos");
          }
        }
      );
    }
  };

  const handleCancel = () => {
    setTitle(loaderData.todo.title);
    setDescription(loaderData.todo.description || "");
    navigate("/todos");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Todo</h1>
      </div>

      <TodoEditor
        mode="edit"
        initialTitle={title}
        initialDescription={description}
        todo={loaderData.todo}
        onSave={(newTitle: string, newDescription?: string) => {
          setTitle(newTitle);
          setDescription(newDescription || "");
        }}
        onCancel={() => {}}
        showTimestamps={true}
      />
      
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={title.length === 0 || updateTodo.isPending}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateTodo.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}