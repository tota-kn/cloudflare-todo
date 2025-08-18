import { useState } from "react";
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from "~/hooks/useTodos";
import type { TodoItem as TodoItemData } from "../../../shared/client";
import { TodoEditor } from "./TodoEditor";

interface TodoItemProps {
  todo: TodoItemData;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const deleteTodo = useDeleteTodo();
  const toggleTodo = useToggleTodo();
  const updateTodo = useUpdateTodo();

  const handleToggleComplete = () => {
    toggleTodo.mutate({ todoId: todo.id, completed: todo.completed });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (title: string, description?: string) => {
    updateTodo.mutate(
      { todoId: todo.id, title, description },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TodoEditor
        mode="edit"
        initialTitle={todo.title}
        initialDescription={todo.description || ""}
        todo={todo}
        onSave={handleSave}
        onCancel={handleCancel}
        onToggleComplete={handleToggleComplete}
        isSaving={updateTodo.isPending}
        isToggling={toggleTodo.isPending}
        showTimestamps={true}
      />
    );
  }

  return (
    <div 
      className={`border rounded-lg py-2 px-4 ${
        todo.completed ? 'bg-muted border-border' : 'bg-card border-border'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggleComplete}
          disabled={toggleTodo.isPending}
          className={`p-2 rounded-full transition-colors disabled:opacity-50 mr-3 ${
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
        <div className="flex-1 min-w-0" onClick={handleEdit}>
          <h3 
            className={`text-base font-semibold cursor-pointer hover:bg-accent/20 rounded px-1 py-0.5 -mx-1 transition-colors ${
              todo.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
            }`}
            title="Click to edit"
          >
            {todo.title}
          </h3>
          {todo.description ? (
            <p 
              className={`mt-0.5 text-sm cursor-pointer hover:bg-accent/20 rounded px-1 py-0.5 -mx-1 transition-colors ${
                todo.completed ? 'text-muted-foreground' : 'text-card-foreground'
              }`}
              title="Click to edit"
            >
              {todo.description}
            </p>
          ) : (
            <p 
              className="mt-0.5 text-sm cursor-pointer hover:bg-accent/20 rounded px-1 py-0.5 -mx-1 transition-colors text-muted-foreground italic"
              title="Click to add description"
            >
              Add description...
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <div className="text-xs text-muted-foreground text-right">
            {todo.updated_at !== todo.created_at && (
              <div>
                Updated: {new Date(todo.updated_at).toLocaleString('ja-JP', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
            <div className={todo.updated_at !== todo.created_at ? "mt-0.5" : ""}>
              Created: {new Date(todo.created_at).toLocaleString('ja-JP', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
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