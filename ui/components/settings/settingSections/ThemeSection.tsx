import ThemeSwitcher from '../../theme/Switcher';
import { SectionProps } from '../types';

/**
 * Theme settings section component
 * Allows users to customize the application's appearance
 *
 * @component
 * @example
 * ```tsx
 * <ThemeSection config={config} onConfigChange={handleConfigChange} />
 * ```
 */
export const ThemeSection = ({ config, onConfigChange }: SectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <p className="text-black/70 dark:text-white/70 text-sm">
          Choose your preferred appearance
        </p>
        <div className="w-full max-w-xs">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};
