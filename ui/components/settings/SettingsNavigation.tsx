import { Palette, Box, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsNavigationProps, SettingsSection } from './types';

/**
 * Configuration for the different settings sections available in the navigation
 */
const navigationItems = [
  {
    id: 'theme' as SettingsSection,
    label: 'Theme',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: 'providers' as SettingsSection,
    label: 'Providers & Models',
    icon: <Box className="w-5 h-5" />,
  },
  {
    id: 'keys' as SettingsSection,
    label: 'API Keys',
    icon: <Key className="w-5 h-5" />,
  },
];

/**
 * Navigation component for switching between different settings sections
 *
 * @component
 * @example
 * ```tsx
 * <SettingsNavigation
 *   activeSection="theme"
 *   onSectionChange={(section) => setActiveSection(section)}
 * />
 * ```
 */
export const SettingsNavigation = ({
  activeSection,
  onSectionChange,
}: SettingsNavigationProps) => (
  <div className="w-48 shrink-0">
    <nav className="flex flex-col space-y-1">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={cn(
            'flex items-center space-x-3 px-3 py-2 rounded-lg hst:rounded-none text-sm font-medium transition-colors',
            activeSection === item.id
              ? 'bg-[#24A0ED] hst:bg-hst-accent text-white'
              : 'text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200',
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </div>
);
