import { useNavigate } from "react-router";
import { createServerFetcher } from "~/client";
import { TodoEditor } from "~/components/TodoEditor";
import { useTheme } from '~/contexts/ThemeContext';
import { useCreateTodo } from "~/hooks/useTodos";
import type { Route } from "./+types/new";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Create New Todo" },
    { name: "description", content: "Create a new todo item" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const client = createServerFetcher(context.cloudflare.env);

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const req = await client.v1.todos.$post({
    json: { title, description: description || undefined }
  });

  const res = await req.json();

  if ('error' in res) {
    throw new Error(res.error);
  }

  return { todo: res };
}

export default function TodoNew({ loaderData }: Route.ComponentProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const createTodo = useCreateTodo();

  const handleSave = (title: string, description?: string) => {
    createTodo.mutate(
      { title, description },
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

  // 新規作成では完了状態のトグルは不要
  const handleToggleComplete = () => {
    // No-op for new todos
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Todo</h1>
        <button
          onClick={() => navigate("/todos")}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      <TodoEditor
        mode="create"
        initialTitle=""
        initialDescription=""
        todo={undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        onToggleComplete={handleToggleComplete}
        isSaving={createTodo.isPending}
        isToggling={false}
        showTimestamps={false}
      />
    </div>
  );
}