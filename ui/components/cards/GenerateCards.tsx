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
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState<CardData[] | null>(existingCards || null);
  const [isViewMode, setIsViewMode] = useState(Boolean(existingCards));

  const handleGenerate = async () => {
    if (isViewMode) {
      setIsDialogOpen(true);
      setCards(existingCards ? existingCards : null);
      return;
    }

    setIsGenerating(true);
    setIsDialogOpen(true);
    setIsViewMode(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cards/createStack`,
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
        setCards(data.stack.cards);
        toast.success('Cards generated successfully');
      } else {
        toast.error('Failed to generate cards');
      }
      setIsGenerating(false);
    } catch (error) {
      toast.error('Failed to generate cards');
      setIsGenerating(false);
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
        initialCards={cards ? cards : []}
        isGenerating={isGenerating}
      />
    </>
  );
};

export default GenerateCards;
