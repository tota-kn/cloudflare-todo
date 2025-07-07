interface ResultDisplayProps {
  title: string;
  result: string;
  type: 'server' | 'client';
}

export function ResultDisplay({ title, result, type }: ResultDisplayProps) {
  const colorClasses = {
    server: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleColor: 'text-green-800',
      textColor: 'text-green-900',
    },
    client: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-900',
    },
  };

  const colors = colorClasses[type];

  return (
    <div className={`p-4 ${colors.bg} rounded border ${colors.border}`}>
      <h2 className={`font-semibold ${colors.titleColor} mb-2`}>{title}</h2>
      <p className={colors.textColor}>{result}</p>
    </div>
  );
}
