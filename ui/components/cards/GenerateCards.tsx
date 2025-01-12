import { FileText, PlusIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '../chat/types';
import { useState } from 'react';
import CardsDialog from './cardsDialog';
import { CardData } from './Card';

interface GenerateCardsProps {
  history: Message[];
  existingCards?: CardData[] | null;
}

const GenerateCards = ({ history, existingCards }: GenerateCardsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isViewMode = Boolean(existingCards);

  const handleGenerate = async (generatedCards: CardData[]) => {
    if (isViewMode) {
      setIsDialogOpen(true);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cards/createCards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatHistory: history.map((msg) => msg.content).join('\n'),
            chatId: history[history.length - 1].chatId,
            cards: generatedCards,
          }),
        },
      );
      if (res.status === 200) {
        const data = await res.json();
        toast.success('Cards generated successfully');
      } else {
        toast.error('Failed to generate cards');
      }
    } catch (error) {
      toast.error('Failed to generate cards');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
      >
        <div className="flex flex-row items-center space-x-2">
          {isViewMode ? <Eye size={17} /> : <FileText size={17} />}
          <p>{isViewMode ? 'View flashcards' : 'Generate flashcards'}</p>
        </div>
        {!isViewMode && (
          <PlusIcon className="text-[#24A0ED] hst:text-hst-accent" size={17} />
        )}
      </button>

      <CardsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode={isViewMode ? 'view' : 'generate'}
        onGenerate={handleGenerate}
        initialCards={existingCards ? existingCards : []}
      />
    </>
  );
};

export default GenerateCards;
