'use client';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Select } from '../SettingsDialog';

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

  return (
    <Select
      className={className}
      value={theme}
      onChange={(e) => handleThemeSwitch(e.target.value as Theme)}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'hst', label: 'HST' },
      ]}
    />
  );
};

export default ThemeSwitcher;
