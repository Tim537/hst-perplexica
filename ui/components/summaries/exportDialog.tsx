import { BsFiletypeDocx, BsFiletypePdf } from 'react-icons/bs';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { exportActions } from '../shared/toolbar/actions/export';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  summaryId: number;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  setIsOpen,
  summaryId,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | null>(
    null,
  );

  const handleExport = async () => {
    if (!selectedFormat) return;

    try {
      await exportActions.summary(summaryId, selectedFormat);
      setIsOpen(false);
    } catch (error) {
      console.error('Error exporting summary:', error);
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
          <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
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
              <DialogPanel className="w-[23rem] transform overflow-hidden border-[2px] rounded-2xl bg-white hst:rounded-none p-6 text-left align-middle shadow-xl transition-all dark:bg-[#111111] dark:border-[#1c1c1c]">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Export Summary
                </DialogTitle>

                <div className="mt-4 flex flex-col gap-4">
                  <button
                    type="button"
                    className={cn(
                      'flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      selectedFormat === 'pdf'
                        ? 'bg-[#24a0ed] text-white  hst:bg-hst-accent'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-light-primary/5',
                      'hst:rounded-none',
                      'focus:outline-none',
                    )}
                    onClick={() => setSelectedFormat('pdf')}
                  >
                    <BsFiletypePdf className="h-5 w-5" />
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      selectedFormat === 'docx'
                        ? ' bg-[#24a0ed] text-white hst:bg-hst-accent'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-light-primary/5',
                      'hst:rounded-none',
                      'focus:outline-none',
                    )}
                    onClick={() => setSelectedFormat('docx')}
                  >
                    <BsFiletypeDocx className="h-5 w-5 " />
                    <span>DOCX</span>
                  </button>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 text-sm font-medium  bg-[#f3f3ee] border border-[#d0d0d0] dark:text-light-primary dark:bg-[#111111] dark:border-[#1c1c1c]  hst:rounded-none "
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        'bg-[#24a0ed]	 text-white hover:bg-[#24a0ed90] ',
                        'hst:bg-hst-accent hst:hover:bg-hst-accent/90 hst:rounded-none',
                        'focus:outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                      )}
                      onClick={handleExport}
                      disabled={!selectedFormat}
                    >
                      Export
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExportDialog;
