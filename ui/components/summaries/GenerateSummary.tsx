import { FileText, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '../chat/types';
import { useState } from 'react';
import SummaryDialog from './summaryDialog';

const GenerateSummary = ({ history }: { history: Message[] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsDialogOpen(true);
    const historyText = history.map((message) => message.content).join('\n');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/summaries/createSummary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatHistory: historyText,
            chatId: history[history.length - 1].chatId,
          }),
        },
      );
      if (res.status === 200) {
        const data = await res.json();
        setSummary(data.summary);
        toast.success('Summary generated successfully');
      } else {
        toast.error('Failed to generate summary');
      }
    } catch (error) {
      toast.error('Failed to generate summary');
    }
  };

  return (
    <>
      <button
        onClick={() => handleGenerate()}
        className="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
      >
        <div className="flex flex-row items-center space-x-2">
          <FileText size={17} />
          <p>Generate summary</p>
        </div>
        <PlusIcon className="text-[#24A0ED] hst:text-hst-accent" size={17} />
      </button>

      <SummaryDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode="generate"
        onGenerate={handleGenerate}
        summary={summary || undefined}
      />
    </>
  );
};

export default GenerateSummary;
