'use client';

import { cn } from '@/lib/utils';
import {
  BookOpenText,
  Home,
  Search,
  SquarePen,
  Settings,
  BrainCircuit,
} from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Home',
    },
    {
      icon: Search,
      href: '/discover',
      active: segments.includes('discover'),
      label: 'Discover',
    },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto hst:bg-hst-accent hst:text-white bg-light-secondary dark:bg-dark-secondary hst:bg-green px-2 py-8">
          <a href="/">
            <SquarePen className="cursor-pointer hover:scale-110 transition duration-150" />
            <div className="h-[24px] w-[24px] " />
          </a>
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'group relative flex flex-row items-center justify-center cursor-pointer duration-150 transition w-full py-2',
                  link.active
                    ? 'text-black dark:text-white hst:text-white'
                    : 'text-black/70 dark:text-white/70 hst:text-white/70',
                )}
              >
                <link.icon />
                {link.active && (
                  <div>
                    <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:left-[4rem]" />
                    <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:right-[4.4rem]" />
                  </div>
                )}
                <div
                  className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white 
                  hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:left-[4rem]
                  opacity-0 translate-x-[16px] hst:group-hover:translate-x-0 hst:group-hover:opacity-100 
                  transition-all duration-200 ease-out
                  hidden hst:block"
                />
                <div
                  className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white 
                  hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:right-[4.4rem]
                  opacity-0 translate-x-[-16px] hst:group-hover:translate-x-0 hst:group-hover:opacity-100 
                  transition-all duration-200 ease-out
                  hidden hst:block"
                />
              </Link>
            ))}
          </VerticalIconContainer>
          <div className="flex flex-col gap-y-8">
            <BrainCircuit className="cursor-pointer hover:scale-110 transition duration-150" />
            <Settings
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="cursor-pointer hover:scale-110 hover:rotate-90 transition duration-150"
            />

            <SettingsDialog
              isOpen={isSettingsOpen}
              setIsOpen={setIsSettingsOpen}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-black dark:text-white'
                : 'text-black dark:text-white/70',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
