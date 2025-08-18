import { useCreateTodo } from "~/hooks/useTodos";
import { TodoEditor } from "./TodoEditor";

interface NewTodoItemProps {
  onCancel: () => void;
}

export function NewTodoItem({ onCancel }: NewTodoItemProps) {
  const createTodo = useCreateTodo();

  const handleSave = (title: string, description?: string) => {
    createTodo.mutate(
      { title, description },
      { onSuccess: onCancel }
    );
  };

  return (
    <TodoEditor
      mode="create"
      onSave={handleSave}
      onCancel={onCancel}
      isSaving={createTodo.isPending}
    />
  );
}