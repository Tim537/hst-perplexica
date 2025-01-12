import { X } from 'lucide-react';
import { Fragment, useState, useEffect } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import Tooltip from '../shared/Tooltip';
import TextContentLoader from '../shared/loadings/TextContentLoader';
import Toolbar from '../shared/toolbar/Toolbar';
import { createSummaryDialogFeatures } from '../shared/toolbar/features/dialogBars';
import { useSummaryContent } from './useSummaryContent';
import { editActions, summaryApi } from '../shared/toolbar/actions/edit';
import ExportDialog from './exportDialog';

/**
 * Props for the SummaryDialog component
 * @interface SummaryDialogProps
 */
interface SummaryDialogProps {
  /** Whether the dialog is visible */
  isOpen: boolean;
  /** Callback to change the dialog's visibility */
  setIsOpen: (isOpen: boolean) => void;
  /** The mode of operation - either generating a new summary or viewing an existing one */
  mode: 'generate' | 'view';
  /** ID of the summary to view (only required in 'view' mode) */
  summaryId: string;
  /** Callback when a summary is generated (only used in 'generate' mode) */
  onGenerate?: (content: string) => void;
  /** The summary to display */
  summary?: string;
  /** Whether the summary is loading */
  isGenerating?: boolean;
  chatId: string;
}

/**
 * A modal dialog component for viewing and generating summaries
 *
 * This component can operate in two modes:
 * 1. Generate mode: Shows an empty dialog with save option for new summaries
 * 2. View mode: Displays an existing summary loaded from the database
 *
 * @example
 * // Generate mode
 * <SummaryDialog
 *   mode="generate"
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   onGenerate={handleGenerate}
 * />
 *
 * // View mode
 * <SummaryDialog
 *   mode="view"
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   summaryId="123"
 * />
 */
const SummaryDialog: React.FC<SummaryDialogProps> = ({
  isOpen,
  setIsOpen,
  mode,
  summaryId,
  onGenerate,
  summary,
  isGenerating,
  chatId,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [currentSummaryId, setCurrentSummaryId] = useState<number | null>(null);

  // Content management
  const { content, setContent, isLoading, error, summaryData } =
    useSummaryContent({
      mode,
      chatId,
    });

  useEffect(() => {
    if (summary) {
      setContent(summary);
    }
  }, [summary, setContent]);

  useEffect(() => {
    if (summaryData?.id) {
      setCurrentSummaryId(summaryData.id);
    } else if (summaryId) {
      setCurrentSummaryId(parseInt(summaryId));
    }
  }, [summaryData, summaryId]);

  // Toolbar configuration
  const features = createSummaryDialogFeatures();

  // Override the edit action
  if (features.edit) {
    features.edit.action = editActions.summary;
  }
  if (features.export) {
    features.export.action = async () => {
      setIsExportOpen(true);
      return Promise.resolve();
    };
  }

  return (
    <>
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
            <div className="fixed inset-0 bg-light-primary/50 dark:bg-dark-primary/50" />
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
                <DialogPanel className="w-full max-w-[47.938rem] transform flex flex-col justify-between rounded-[1.25rem] hst:rounded-none bg-light-primary dark:bg-dark-primary border border-[#E7E7E7] dark:border-dark-200 p-6 text-left align-middle shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.25)] transition-all">
                  {/* Dialog header */}
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl font-medium text-black dark:text-white hst:text-white">
                      {mode === 'generate'
                        ? 'Generate Summary'
                        : 'View Summary'}
                    </DialogTitle>
                    <Tooltip text="Close" spacing="0.5rem">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-[#757573] hover:text-[#454545] dark:hover:text-white hst:text-white/70 hst:hover:text-white/40 transition-colors"
                        aria-label="Close dialog"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </Tooltip>
                  </div>

                  {/* Summary text area */}
                  <div className="mt-6 flex-grow">
                    <div className="w-full h-[23.948rem] rounded-[0.625rem] hst:rounded-none border-2 border-[#CCCCCC] dark:border-dark-200 p-4">
                      {isLoading ? (
                        <TextContentLoader
                          lines={3}
                          lineWidths={['100%', '75%', '85%']}
                          fullWidth
                          className="bg-transparent"
                        />
                      ) : error ? (
                        <div className="text-red-500">{error}</div>
                      ) : isGenerating ? (
                        <div>Generating...</div>
                      ) : (
                        <div>{content}</div>
                      )}
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="mt-6 flex justify-center w-full">
                    <div className="flex">
                      <Toolbar
                        features={features}
                        content={content}
                        spacing={[1.5, 1.5, 1.5]}
                      />
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Export Dialog */}
      {currentSummaryId && (
        <ExportDialog
          isOpen={isExportOpen}
          setIsOpen={setIsExportOpen}
          summaryId={currentSummaryId}
        />
      )}
    </>
  );
};

export default SummaryDialog;
