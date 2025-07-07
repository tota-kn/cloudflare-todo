import { useDeleteTodo, useToggleTodo } from "~/hooks/useTodos";
import type { TodoItem as TodoItemData } from "../../../shared/client";

interface TodoItemProps {
  todo: TodoItemData;
  onEdit: (todo: TodoItemData) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const deleteTodo = useDeleteTodo();
  const toggleTodo = useToggleTodo();

  const handleToggleComplete = () => {
    toggleTodo.mutate({ id: todo.id, completed: todo.completed });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo.id);
    }
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${
        todo.completed ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            todo.completed ? 'line-through text-gray-500' : 'text-black'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.completed ? 'text-gray-500' : 'text-black'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-600">
            Created: {new Date(todo.created_at).toLocaleDateString()}
            {todo.updated_at !== todo.created_at && (
              <span className="ml-2">
                Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            todo.completed 
              ? 'bg-green-100 text-green-900' 
              : 'bg-orange-100 text-orange-900'
          }`}>
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
          <button
            onClick={handleToggleComplete}
            disabled={toggleTodo.isPending}
            className={`px-3 py-1 text-xs rounded font-medium disabled:opacity-50 ${
              todo.completed
                ? 'bg-orange-200 text-black hover:bg-orange-300'
                : 'bg-green-200 text-black hover:bg-green-300'
            }`}
          >
            {toggleTodo.isPending ? 'Updating...' : (todo.completed ? 'Mark Pending' : 'Mark Complete')}
          </button>
          <button
            onClick={() => onEdit(todo)}
            className="px-3 py-1 text-xs rounded font-medium bg-blue-200 text-black hover:bg-blue-300"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            className="px-3 py-1 text-xs rounded font-medium bg-red-200 text-black hover:bg-red-300 disabled:opacity-50"
          >
            {deleteTodo.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}