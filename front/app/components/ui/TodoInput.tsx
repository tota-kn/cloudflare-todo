import React from 'react';

interface TodoInputProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTitleKeyDown?: (e: React.KeyboardEvent) => void;
  onDescriptionKeyDown?: (e: React.KeyboardEvent) => void;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  autoFocusTitle?: boolean;
  showHelpText?: boolean;
  mode?: 'create' | 'edit';
}

export function TodoInput({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onTitleKeyDown,
  onDescriptionKeyDown,
  titlePlaceholder = "Todo title...",
  descriptionPlaceholder = "Add description...",
  autoFocusTitle = false,
  showHelpText = false,
  mode = 'create'
}: TodoInputProps) {
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoFocusTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [autoFocusTitle]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (onTitleKeyDown) {
      onTitleKeyDown(e);
    }
    
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      descriptionTextareaRef.current?.focus();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (onDescriptionKeyDown) {
      onDescriptionKeyDown(e);
    }
    
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      titleInputRef.current?.focus();
    }
  };

  return (
    <div className="flex-1">
      <input
        ref={titleInputRef}
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        className={`font-semibold bg-transparent border-b border-primary focus:outline-none focus:border-primary w-full ${
          mode === 'create' ? 'text-lg' : 'text-base'
        }`}
        placeholder={titlePlaceholder}
        autoFocus={autoFocusTitle}
        data-todo-title
      />
      <textarea
        ref={descriptionTextareaRef}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        onKeyDown={handleDescriptionKeyDown}
        className={`mt-1 text-sm bg-transparent focus:outline-none w-full resize-none ${
          mode === 'edit' ? 'border-b border-primary focus:border-primary pb-0 leading-tight' : 'border border-primary focus:border-primary'
        }`}
        rows={1}
        placeholder={descriptionPlaceholder}
        data-todo-description
      />
      {showHelpText && (
        <div className="mt-2 text-xs text-muted-foreground">
          Press Enter to save, Escape to cancel, Tab to navigate
        </div>
      )}
    </div>
  );
}