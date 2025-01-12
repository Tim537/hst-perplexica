import { FileText, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from '../chat/types';
import { useState } from 'react';
import CardsDialog from './cardsDialog';
import { CardData } from './Card';

const GenerateCards = ({ message }: { message: Message }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerate = async (cards: CardData[]) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cards/createCards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatHistory: message.content,
            chatId: message.chatId,
            cards: cards,
          }),
        },
      );
      if (res.ok) {
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
          <FileText size={17} />
          <p>Generate flashcards</p>
        </div>
        <PlusIcon className="text-[#24A0ED] hst:text-hst-accent" size={17} />
      </button>

      <CardsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        mode="generate"
        onGenerate={handleGenerate}
      />
    </>
  );
};

export default GenerateCards;
