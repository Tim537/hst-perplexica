import { FileText, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MemoryNavigationProps, MemorySection } from './types';

/**
 * Configuration for the different memory sections available in the navigation
 */
const navigationItems = [
  {
    id: 'meta' as MemorySection,
    label: 'Meta Memories',
    icon: <FileText className="w-5 h-5" />,
    description:
      'Memories which affects the Meta Search, e.g. Answer always in simple english',
  },
  {
    id: 'image' as MemorySection,
    label: 'Image Memories',
    icon: <Image className="w-5 h-5" />,
    description:
      'Memories which affects the Image Search, e.g. search just black white Images',
  },
  {
    id: 'video' as MemorySection,
    label: 'Video Memories',
    icon: <Video className="w-5 h-5" />,
    description:
      'Memories which affects the Video Search, e.g. search just english-speaking videos',
  },
];

/**
 * Navigation component for switching between different memory sections
 *
 * @component
 * @example
 * ```tsx
 * <MemoryNavigation
 *   activeSection="meta"
 *   onSectionChange={(section) => setActiveSection(section)}
 * />
 * ```
 */
export const MemoryNavigation = ({
  activeSection,
  onSectionChange,
}: MemoryNavigationProps) => (
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

/**
 * Helper function to get navigation item details for a specific section
 *
 * @param section - The section to get details for
 * @returns The navigation item details or undefined if not found
 */
export const getNavigationItem = (section: MemorySection) =>
  navigationItems.find((item) => item.id === section);
