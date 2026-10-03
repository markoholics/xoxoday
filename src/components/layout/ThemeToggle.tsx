import { toggleTheme, useTheme } from '@/lib/prefs';
import { IconMoon, IconSun } from '../ui/Icons';

export function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-full p-2 text-ink transition-colors duration-200 hover:bg-sunken"
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}
