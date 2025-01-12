import { X, FileText, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { exportActions } from '../shared/toolbar/actions/export';

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
  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      await exportActions.summary(summaryId, format);
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
          <div className="fixed inset-0 bg-black/25" />
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Export Summary
                  </DialogTitle>
                  <button
                    type="button"
                    className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => handleExport('pdf')}
                  >
                    <FileText className="h-5 w-5" />
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => handleExport('docx')}
                  >
                    <FileDown className="h-5 w-5" />
                    <span>DOCX</span>
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

export default ExportDialog;
