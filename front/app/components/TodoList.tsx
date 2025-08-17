import type { TodoItem as TodoItemData } from "../../../shared/client";
import { NewTodoItem } from "./NewTodoItem";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: TodoItemData[];
  showNewTodoForm?: boolean;
  onCancelNewTodo?: () => void;
}

export function TodoList({ todos, showNewTodoForm, onCancelNewTodo }: TodoListProps) {
  return (
    <div className="space-y-4">
      {showNewTodoForm && onCancelNewTodo && (
        <NewTodoItem onCancel={onCancelNewTodo} />
      )}
      
      {todos.length === 0 && !showNewTodoForm ? (
        <p className="text-black text-center py-8">No todos found. Create your first todo!</p>
      ) : (
        todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
          />
        ))
      )}
    </div>
  );
}