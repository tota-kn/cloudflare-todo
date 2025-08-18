interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'save' | 'cancel' | 'delete' | 'toggle-complete' | 'toggle-pending';
  isLoading?: boolean;
  title?: string;
}

export function ActionButton({ 
  onClick, 
  disabled = false, 
  variant, 
  isLoading = false,
  title 
}: ActionButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'save':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'cancel':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'delete':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      case 'toggle-complete':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'toggle-pending':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }

    switch (variant) {
      case 'save':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'toggle-complete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'cancel':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'delete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'toggle-pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  const getTitle = () => {
    if (title) return title;
    if (isLoading) {
      switch (variant) {
        case 'save': return 'Saving...';
        case 'delete': return 'Deleting...';
        case 'toggle-complete':
        case 'toggle-pending': return 'Updating...';
        default: return 'Loading...';
      }
    }
    
    switch (variant) {
      case 'save': return 'Save';
      case 'cancel': return 'Cancel';
      case 'delete': return 'Delete';
      case 'toggle-complete': return 'Mark Complete';
      case 'toggle-pending': return 'Mark Pending';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`p-2 rounded-full transition-colors disabled:opacity-50 ${getVariantStyles()}`}
      title={getTitle()}
    >
      {getIcon()}
    </button>
  );
}