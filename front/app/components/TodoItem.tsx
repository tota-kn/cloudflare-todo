import { useDeleteTodo, useToggleTodo } from "~/hooks/useTodos";
import type { TodoItem as TodoItemData } from "../../../shared/client";
import { ActionButton } from "./CircleButton";
import { useNavigate } from "react-router";

interface TodoItemProps {
  todo: TodoItemData;
}

export function TodoItem({ todo }: TodoItemProps) {
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate(`/todos/${todo.id}`);
  };

  return (
    <div 
      className={`border rounded-lg py-2 px-4 cursor-pointer hover:bg-accent/10 transition-colors ${
        todo.completed ? 'bg-muted border-border' : 'bg-card border-border'
      }`}
      onClick={handleEdit}
      title="Click to edit"
    >
      <div className="flex items-center justify-between">
        <div className="mr-3" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            onClick={handleToggleComplete}
            disabled={toggleTodo.isPending}
            variant={todo.completed ? 'toggle-pending' : 'toggle-complete'}
            isLoading={toggleTodo.isPending}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className={`text-base font-semibold ${
              todo.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p 
              className={`mt-0.5 text-sm ${
                todo.completed ? 'text-muted-foreground' : 'text-card-foreground'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-3" onClick={(e) => e.stopPropagation()}>
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
          <ActionButton
            onClick={handleDelete}
            disabled={deleteTodo.isPending}
            variant="delete"
            isLoading={deleteTodo.isPending}
          />
        </div>
      </div>
    </div>
  );
}