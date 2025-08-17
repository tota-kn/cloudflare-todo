import type { TodoItem as TodoItemData } from "../../../shared/client";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: TodoItemData[];
}

export function TodoList({ todos }: TodoListProps) {
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
        />
      ))}
    </div>
  );
}