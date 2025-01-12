import { FileText, PlusIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '../chat/types';
import { useState } from 'react';
import SummaryDialog from './summaryDialog';

interface GenerateSummaryProps {
  history: Message[];
  existingSummary?: string | null;
}

const GenerateSummary = ({
  history,
  existingSummary,
}: GenerateSummaryProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(
    existingSummary || null,
  );
  const [isGenerating, setIsLoading] = useState(false);
  const isViewMode = Boolean(existingSummary);

  const handleGenerate = async () => {
    if (isViewMode) {
      setIsDialogOpen(true);
      setSummary(existingSummary ? existingSummary : null);
      return;
    }

    setIsLoading(true);
    setIsDialogOpen(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/summaries/createSummary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatHistory: history,
            chatId: history[history.length - 1].chatId,
          }),
        },
      );
      if (res.status === 200 || res.status === 201) {
        const data = await res.json();
        setSummary(data.summary);
        toast.success('Summary generated successfully');
      } else {
        toast.error('Failed to generate summary');
      }
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to generate summary');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => handleGenerate()}
        className="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
      >
        <div className="flex flex-row items-center space-x-2">
          {isViewMode ? <Eye size={17} /> : <FileText size={17} />}
          <p>{isViewMode ? 'View summary' : 'Generate summary'}</p>
        </div>
        {!isViewMode && (
          <PlusIcon className="text-[#24A0ED] hst:text-hst-accent" size={17} />
        )}
      </button>

      <SummaryDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode={isViewMode ? 'view' : 'generate'}
        onGenerate={handleGenerate}
        summary={summary || undefined}
        isGenerating={isGenerating}
      />
    </>
  );
};

export default GenerateSummary;
