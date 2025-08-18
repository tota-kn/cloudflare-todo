import { useState } from "react";
import { useDeleteTodo, useToggleTodo, useUpdateTodo } from "~/hooks/useTodos";
import type { TodoItem as TodoItemData } from "../../../shared/client";
import { TodoEditor } from "./TodoEditor";
import { CheckIcon, DeleteIcon, ResetIcon } from "./ui/Icon";

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
          className={`p-2 rounded-full transition-colors disabled:opacity-50 mr-3 bg-primary text-primary-foreground hover:bg-primary/90`}
          title={toggleTodo.isPending ? 'Updating...' : (todo.completed ? 'Mark Pending' : 'Mark Complete')}
        >
          {toggleTodo.isPending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : todo.completed ? (
            <ResetIcon />
          ) : (
            <CheckIcon />
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
              <DeleteIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}