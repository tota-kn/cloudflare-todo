interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
      Error: {message}
    </div>
  );
}