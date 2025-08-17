import { Form } from "react-router";
import { useCreateTodo } from "~/hooks/useTodos";

interface TodoFormProps {
  onCancel: () => void;
}

export function TodoForm({ onCancel }: TodoFormProps) {
  const createTodo = useCreateTodo();

  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Create New Todo
      </h2>
      <Form method="post" onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        
        createTodo.mutate(
          { title, description: description || undefined },
          { onSuccess: () => onCancel() }
        );
      }}>
        <input type="hidden" name="action" value="create" />
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border-2 border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground bg-background"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-3 py-2 border-2 border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground bg-background"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={createTodo.isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {createTodo.isPending ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}