import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { getStoredTheme, setStoredTheme } from '../../utils/storage';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getStoredTheme());

  useEffect(() => {
    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    applyTheme(theme);
    setStoredTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycleTheme}
      id="theme-toggle-btn"
      title={`Theme: ${theme.toUpperCase()} (Click to change)`}
      aria-label="Toggle theme mode"
      className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 flex items-center gap-1.5 text-xs font-medium"
    >
      {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
      {theme === 'system' && <Monitor className="w-4 h-4 text-slate-500" />}
      <span className="hidden sm:inline capitalize">{theme}</span>
    </button>
  );
}
