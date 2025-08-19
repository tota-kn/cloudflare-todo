import type { TodoItem as TodoItemData } from "../../../shared/client";
import { NewTodoItem } from "./NewTodoItem";
import { TodoItem } from "./TodoItem";

interface TodoSectionProps {
  title: string;
  todos: TodoItemData[];
}

function TodoSection({ title, todos }: TodoSectionProps) {
  if (todos.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
          />
        ))}
      </div>
    </div>
  );
}

interface TodoListProps {
  todos: TodoItemData[];
  showNewTodoForm?: boolean;
  onCancelNewTodo?: () => void;
}

export function TodoList({ todos, showNewTodoForm, onCancelNewTodo }: TodoListProps) {
  const incompleteTodos = todos.filter(todo => !todo.completed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  const completedTodos = todos.filter(todo => todo.completed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <div className="space-y-6">
      {showNewTodoForm && onCancelNewTodo && (
        <NewTodoItem onCancel={onCancelNewTodo} />
      )}
      
      {todos.length === 0 && !showNewTodoForm ? (
        <p className="text-black text-center py-8">No todos found. Create your first todo!</p>
      ) : (
        <>
          <TodoSection title="Pending Tasks" todos={incompleteTodos} />
          <TodoSection title="Completed Tasks" todos={completedTodos} />
        </>
      )}
    </div>
  );
}