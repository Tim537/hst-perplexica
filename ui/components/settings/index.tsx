import { X, RefreshCcw, RefreshCw, CloudUpload } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { SettingsDialogProps, SettingsSection, SettingsType } from './types';
import { SettingsNavigation } from './SettingsNavigation';
import { ThemeSection } from './settingSections/ThemeSection';
import { ProvidersSection } from './settingSections/ProvidersSection';
import { KeysSection } from './settingSections/KeysSection';

/**
 * Main Settings dialog component that provides a modal interface for all application settings
 *
 * @component
 * @example
 * ```tsx
 * <SettingsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
 * ```
 */
const SettingsDialog = ({ isOpen, setIsOpen }: SettingsDialogProps) => {
  // State management
  const [config, setConfig] = useState<SettingsType | null>(null);
  const [activeSection, setActiveSection] = useState<SettingsSection>('theme');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Fetches the current settings configuration from the API
   */
  useEffect(() => {
    if (isOpen) {
      const fetchConfig = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = (await res.json()) as SettingsType;
          setConfig(data);
        } catch (err) {
          console.error('Failed to fetch config:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchConfig();
    }
  }, [isOpen]);

  /**
   * Handles the form submission and updates the settings
   */
  const handleSubmit = async () => {
    if (!config) return;

    setIsUpdating(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Renders the active section content
   */
  const renderContent = () => {
    if (!config || isLoading) return null;

    switch (activeSection) {
      case 'theme':
        return <ThemeSection config={config} onConfigChange={setConfig} />;
      case 'providers':
        return <ProvidersSection config={config} onConfigChange={setConfig} />;
      case 'keys':
        return <KeysSection config={config} onConfigChange={setConfig} />;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-200"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform rounded-2xl hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
                {/* Dialog header */}
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle className="text-xl font-medium text-black dark:text-white">
                    Settings
                  </DialogTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                    title="Close dialog"
                    aria-label="Close dialog"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Dialog content */}
                <div className="flex gap-8">
                  <SettingsNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                  <div className="flex-1 min-w-0">
                    {isLoading ? (
                      <div className="w-full flex items-center justify-center py-6 text-black/70 dark:text-white/70">
                        <RefreshCcw className="animate-spin" />
                      </div>
                    ) : (
                      renderContent()
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 space-y-2">
                  <p className="text-xs text-black/50 dark:text-white/50">
                    We&apos;ll refresh the page after updating the settings.
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#24A0ED] hst:bg-hst-accent hst:rounded-none hst:hover:scale-110 flex flex-row items-center space-x-2 text-white disabled:text-white/50 hover:bg-opacity-85 transition duration-100 disabled:bg-[#ececec21] rounded-full px-4 py-2"
                    disabled={isLoading || isUpdating}
                  >
                    {isUpdating ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <CloudUpload size={20} />
                    )}
                    <span>Update</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SettingsDialog;
