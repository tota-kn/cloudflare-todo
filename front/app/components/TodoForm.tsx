import { Form } from "react-router";
import { useCreateTodo, useUpdateTodo } from "~/hooks/useTodos";
import { FileUpload } from "./FileUpload";
import { AttachmentList } from "./AttachmentList";
import type { TodoItem } from "../../../shared/client";

interface TodoFormProps {
  editingTodo: TodoItem | null;
  onCancel: () => void;
}

export function TodoForm({ editingTodo, onCancel }: TodoFormProps) {
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        {editingTodo ? 'Edit Todo' : 'Create New Todo'}
      </h2>
      <Form method="post" onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        
        if (editingTodo) {
          const completed = formData.get("completed") === "true";
          updateTodo.mutate(
            { id: editingTodo.id, title, description, completed },
            { onSuccess: () => onCancel() }
          );
        } else {
          createTodo.mutate(
            { title, description },
            { onSuccess: () => onCancel() }
          );
        }
      }}>
        <input type="hidden" name="action" value={editingTodo ? "update" : "create"} />
        {editingTodo && <input type="hidden" name="id" value={editingTodo.id} />}
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={editingTodo?.title || ""}
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
            defaultValue={editingTodo?.description || ""}
            rows={3}
            className="w-full px-3 py-2 border-2 border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground bg-background"
          />
        </div>
        
        {editingTodo && (
          <div className="mb-4">
            <label className="flex items-center text-foreground">
              <input
                type="checkbox"
                name="completed"
                defaultChecked={editingTodo.completed}
                value="true"
                className="mr-2"
              />
              Completed
            </label>
          </div>
        )}

        {editingTodo && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-foreground mb-3">添付ファイル</h3>
            <div className="space-y-4">
              <FileUpload todoId={editingTodo.id} />
              <AttachmentList todoId={editingTodo.id} />
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={createTodo.isPending || updateTodo.isPending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {createTodo.isPending || updateTodo.isPending 
              ? 'Saving...' 
              : (editingTodo ? 'Update' : 'Create')}
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