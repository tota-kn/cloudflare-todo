import { useState } from "react";
import { useCreateTodo } from "~/hooks/useTodos";

interface NewTodoItemProps {
  onCancel: () => void;
}

export function NewTodoItem({ onCancel }: NewTodoItemProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const createTodo = useCreateTodo();

  const handleSave = () => {
    if (title.trim()) {
      createTodo.mutate(
        { 
          title: title.trim(), 
          description: description.trim() || undefined 
        },
        { 
          onSuccess: () => {
            setTitle("");
            setDescription("");
            onCancel();
          }
        }
      );
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    onCancel();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const descriptionInput = document.querySelector('textarea[data-new-todo-description]') as HTMLTextAreaElement;
      if (descriptionInput) {
        descriptionInput.focus();
      }
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      const titleInput = document.querySelector('input[data-new-todo-title]') as HTMLInputElement;
      if (titleInput) {
        titleInput.focus();
      }
    }
  };

  return (
    <div className="border-2 rounded-lg p-4 bg-card border-border animate-in slide-in-from-top-1 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            className="text-lg font-semibold bg-transparent border-b border-primary focus:outline-none focus:border-primary w-full"
            placeholder="Todo title..."
            autoFocus
            data-new-todo-title
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
            className="mt-1 text-sm bg-transparent border border-primary focus:outline-none focus:border-primary w-full resize-none"
            rows={2}
            placeholder="Add description..."
            data-new-todo-description
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to save, Escape to cancel, Tab to navigate
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleSave}
            disabled={!title.trim() || createTodo.isPending}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            title={createTodo.isPending ? 'Creating...' : 'Save'}
          >
            {createTodo.isPending ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            title="Cancel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}