import { TodoItem } from "./TodoItem";

interface TodoItemData {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

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