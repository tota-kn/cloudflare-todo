import { useTheme } from '~/contexts/ThemeContext';
import { ActionButton } from './ActionButton';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ActionButton
      onClick={toggleTheme}
      variant={theme === 'light' ? 'theme-light' : 'theme-dark'}
    />
  );
}