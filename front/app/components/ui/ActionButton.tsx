import { CheckIcon, DeleteIcon, ResetIcon, SaveIcon, XIcon } from './Icon';

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
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
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
        return <SaveIcon />;
      case 'toggle-complete':
        return <CheckIcon />;
      case 'cancel':
        return <XIcon />;
      case 'delete':
        return <DeleteIcon />;
      case 'toggle-pending':
        return <ResetIcon />;
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