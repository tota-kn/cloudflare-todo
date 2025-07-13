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
    toggleTodo.mutate({ todoId: todo.id, completed: todo.completed });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo.id);
    }
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${
        todo.completed ? 'bg-muted border-border' : 'bg-card border-border'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            todo.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.completed ? 'text-muted-foreground' : 'text-card-foreground'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            Created: {new Date(todo.created_at).toLocaleDateString()}
            {todo.updated_at !== todo.created_at && (
              <span className="ml-2">
                Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleComplete}
            disabled={toggleTodo.isPending}
            className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
              todo.completed
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            title={toggleTodo.isPending ? 'Updating...' : (todo.completed ? 'Mark Pending' : 'Mark Complete')}
          >
            {toggleTodo.isPending ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : todo.completed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onEdit(todo)}
            className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
            title={deleteTodo.isPending ? 'Deleting...' : 'Delete'}
          >
            {deleteTodo.isPending ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}