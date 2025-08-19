import { useState } from "react";
import type { TodoItem as TodoItemData } from "../../../shared/client";
import { ActionButton } from "./ActionButton";
import { TodoInput } from "./TodoInput";

interface TodoEditorProps {
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialDescription?: string;
  todo?: TodoItemData;
  onSave: (title: string, description?: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
  showTimestamps?: boolean;
}

export function TodoEditor({
  mode,
  initialTitle = "",
  initialDescription = "",
  todo,
  onSave,
  onCancel,
  onDelete,
  onToggleComplete,
  isSaving = false,
  isDeleting = false,
  isToggling = false,
  showTimestamps = false
}: TodoEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), description.trim() || undefined);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    onCancel();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const canSave = title.trim() && (
    mode === 'create' || 
    title.trim() !== initialTitle || 
    (description.trim() || "") !== (initialDescription || "")
  );

  return (
    <div className={`border rounded-lg py-2 px-4 ${
      mode === 'create' 
        ? 'bg-card border-border animate-in slide-in-from-top-1 duration-200'
        : todo?.completed ? 'bg-muted border-border' : 'bg-card border-border'
    }`}>
      <div className="flex items-center justify-between">
        {mode === 'edit' && onToggleComplete && (
          <div className="mr-3">
            <ActionButton
              onClick={onToggleComplete}
              variant={todo?.completed ? 'toggle-pending' : 'toggle-complete'}
              isLoading={isToggling}
              disabled={isToggling}
            />
          </div>
        )}
        
        <TodoInput
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onTitleKeyDown={handleTitleKeyDown}
          onDescriptionKeyDown={handleDescriptionKeyDown}
          autoFocusTitle={mode === 'create'}
          showHelpText={mode === 'create'}
          mode={mode}
        />
        
        <div className="flex items-center space-x-2 ml-4">
          {showTimestamps && todo && (
            <div className="text-xs text-muted-foreground text-right mr-1">
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
          )}
          
          <ActionButton
            onClick={handleSave}
            variant="save"
            disabled={!canSave || isSaving}
            isLoading={isSaving}
          />
          
          <ActionButton
            onClick={handleCancel}
            variant="cancel"
          />
        </div>
      </div>
    </div>
  );
}