import type { TodoItem as TodoItemData } from "../../../shared/client";
import { NewTodoItem } from "./NewTodoItem";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: TodoItemData[];
  showNewTodoForm?: boolean;
  onCancelNewTodo?: () => void;
}

export function TodoList({ todos, showNewTodoForm, onCancelNewTodo }: TodoListProps) {
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {showNewTodoForm && onCancelNewTodo && (
        <NewTodoItem onCancel={onCancelNewTodo} />
      )}
      
      {todos.length === 0 && !showNewTodoForm ? (
        <p className="text-black text-center py-8">No todos found. Create your first todo!</p>
      ) : (
        <>
          {incompleteTodos.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Pending Tasks</h2>
              {incompleteTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                />
              ))}
            </div>
          )}
          
          {completedTodos.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground/60">Completed Tasks</h2>
              <div className="opacity-75 space-y-2">
                {completedTodos.map((todo) => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}