'use client';

import { cn } from '@/lib/utils';
import {
  History,
  Home,
  Telescope,
  SquarePen,
  Settings,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from '../layout/Layout';
import SettingsDialog from '../../settings';
import Memories from '@/components/memories';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto hst:bg-hst-accent hst:text-white bg-light-secondary dark:bg-dark-secondary hst:bg-green px-2 py-8">
          <div className="flex flex-col gap-y-3 w-full">
            <a
              href="/"
              className={cn(
                'group relative flex flex-row items-center justify-center cursor-pointer duration-150 transition w-full py-2',
                segments.length === 0
                  ? 'text-black dark:text-white hst:text-white'
                  : 'text-black/85 dark:text-white/85 hst:text-white/85',
              )}
            >
              <SquarePen className="hover:scale-110 transition duration-150" />
            </a>
            <a
              href="/library"
              className={cn(
                'group relative flex flex-row items-center justify-center cursor-pointer duration-150 transition w-full py-2',
                segments.includes('library')
                  ? 'text-black dark:text-white hst:text-white'
                  : 'text-black/85 dark:text-white/85 hst:text-white/85',
              )}
            >
              <History className="hover:scale-110 transition duration-150" />
            </a>
          </div>

          <VerticalIconContainer>
            {[
              {
                icon: Home,
                href: '/',
                active: segments.length === 0 || segments.includes('c'),
                label: 'Home',
              },
              {
                icon: GraduationCap,
                href: '/test',
                active: segments.includes('test'),
                label: 'Learn',
              },
              {
                icon: Telescope,
                href: '/discover',
                active: segments.includes('discover'),
                label: 'Discover',
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className={cn(
                  'group relative flex flex-row items-center justify-center cursor-pointer duration-150 transition w-full py-2',
                  link.active
                    ? 'text-black dark:text-white hst:text-white'
                    : 'text-black/85 dark:text-white/85 hst:text-white/85',
                )}
              >
                <link.icon className="hover:scale-110 transition duration-150" />
                {link.active && (
                  <div>
                    <div className="absolute right-0 -mr-2 h-full w-1 top-0 rounded-l-lg bg-black dark:bg-white hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:left-[4rem]" />
                    <div className="absolute right-0 -mr-2 h-full w-1 hidden hst:block rounded-l-lg bg-black dark:bg-white hst:bg-white hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:right-[4.4rem]" />
                  </div>
                )}
                <div
                  className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white 
                  hst:bg-hst-primary hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:left-[4rem]
                  opacity-0 translate-x-[16px] hst:group-hover:translate-x-0 hst:group-hover:opacity-100 
                  transition-all duration-200 ease-out
                  hidden hst:block"
                />
                <div
                  className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white 
                  hst:bg-hst-primary hst:rounded-none hst:w-[20px] hst:h-[20px] hst:rotate-[135deg] hst:top-[0.61rem] hst:right-[4.4rem]
                  opacity-0 translate-x-[-16px] hst:group-hover:translate-x-0 hst:group-hover:opacity-100 
                  transition-all duration-200 ease-out
                  hidden hst:block"
                />
              </a>
            ))}
          </VerticalIconContainer>

          <div className="flex flex-col gap-y-8">
            <BrainCircuit
              onClick={() => setIsMemoriesOpen(!isMemoriesOpen)}
              className="cursor-pointer hover:scale-110 transition duration-150 text-black/85 dark:text-white/85 hst:text-white/85 hover:text-black dark:hover:text-white hst:hover:text-white"
            />
            <Memories isOpen={isMemoriesOpen} setIsOpen={setIsMemoriesOpen} />

            <Settings
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="cursor-pointer hover:scale-110 hover:rotate-90 transition duration-150 text-black/85 dark:text-white/85 hst:text-white/85 hover:text-black dark:hover:text-white hst:hover:text-white"
            />

            <SettingsDialog
              isOpen={isSettingsOpen}
              setIsOpen={setIsSettingsOpen}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        {[
          {
            icon: Home,
            href: '/',
            active: segments.length === 0 || segments.includes('c'),
            label: 'Home',
          },
          {
            icon: GraduationCap,
            href: '/test',
            active: segments.includes('test'),
            label: 'Learn',
          },
          {
            icon: Telescope,
            href: '/discover',
            active: segments.includes('discover'),
            label: 'Discover',
          },
        ].map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-black dark:text-white'
                : 'text-black dark:text-white/85',
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
