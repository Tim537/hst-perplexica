/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Document } from '@langchain/core/documents';
import { File } from 'lucide-react';
import { Fragment } from 'react';
import { MessageSourceProps } from '../types';

const MessageSources = ({ sources, isOpen, setIsOpen }: MessageSourceProps) => {
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition duration-100"
      >
        <File size={14} />
        <span className="text-xs">{sources.length} sources</span>
      </button>

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
            <div className="fixed inset-0 bg-black/25 dark:bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-black dark:text-white"
                  >
                    Sources
                  </DialogTitle>
                  <div className="mt-4 space-y-4">
                    {sources.map((source, i) => (
                      <div
                        key={i}
                        className="flex flex-col space-y-2 bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg"
                      >
                        <div className="flex flex-row items-center justify-between">
                          <a
                            href={source.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#24A0ED] hover:underline"
                          >
                            {source.metadata.url}
                          </a>
                        </div>
                        <p className="text-sm text-black/70 dark:text-white/70">
                          {source.pageContent}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MessageSources;
