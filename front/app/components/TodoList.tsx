import { TodoItem } from "./TodoItem";
import type { TodoItem as TodoItemData } from "../../../shared/client";

interface TodoListProps {
  todos: TodoItemData[];
  onEdit: (todo: TodoItemData) => void;
}

export function TodoList({ todos, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-black text-center py-8">No todos found. Create your first todo!</p>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}