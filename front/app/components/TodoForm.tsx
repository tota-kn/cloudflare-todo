import { Form } from "react-router";
import { useCreateTodo, useUpdateTodo } from "~/hooks/useTodos";
import type { TodoItem } from "../../../shared/client";

interface TodoFormProps {
  editingTodo: TodoItem | null;
  onCancel: () => void;
}

export function TodoForm({ editingTodo, onCancel }: TodoFormProps) {
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-black">
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
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={editingTodo?.title || ""}
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={editingTodo?.description || ""}
            rows={3}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        
        {editingTodo && (
          <div className="mb-4">
            <label className="flex items-center text-black">
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
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={createTodo.isPending || updateTodo.isPending}
            className="bg-green-200 text-black px-4 py-2 rounded hover:bg-green-300 disabled:opacity-50"
          >
            {createTodo.isPending || updateTodo.isPending 
              ? 'Saving...' 
              : (editingTodo ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}