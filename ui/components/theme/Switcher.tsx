'use client';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, StarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'dark' | 'light' | 'hst';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const isTheme = useCallback((t: Theme) => t === theme, [theme]);

  const handleThemeSwitch = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
    if (!theme) {
      setTheme('dark');
    }
  }, []);

  // Avoid Hydration Mismatch
  if (!mounted) {
    return null;
  }

  const themes = [
    {
      value: 'light' as Theme,
      label: 'Light',
      icon: <SunIcon className="w-5 h-5" />,
    },
    {
      value: 'dark' as Theme,
      label: 'Dark',
      icon: <MoonIcon className="w-5 h-5" />,
    },
    {
      value: 'hst' as Theme,
      label: 'HST',
      icon: <StarIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {themes.map((item) => (
        <button
          key={item.value}
          onClick={() => handleThemeSwitch(item.value)}
          className={cn(
            'flex items-center space-x-3 px-3 py-2 rounded-lg hst:rounded-none text-sm font-medium transition-colors',
            isTheme(item.value)
              ? 'bg-[#24A0ED] hst:bg-hst-accent text-white'
              : 'text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200',
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
