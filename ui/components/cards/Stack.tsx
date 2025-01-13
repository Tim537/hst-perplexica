import { cn } from '@/lib/utils';
import { Card, Stack } from './types';
import Toolbar from '../shared/toolbar/Toolbar';
import { createStackBarFeatures } from '../shared/toolbar/features/editorBars';
import Checkbox from '../shared/forms/Checkbox';
import { cardsApi } from '../shared/toolbar/actions/edit';

interface StackProps {
  stack: Stack;
  cards: Record<string, Card>;
  selectedCard: Card | null;
  isEditMode: boolean;
  selectedCards: Set<string>;
  onCardSelect: (card: Card) => void;
  onCheckboxChange: (cardId: string, checked: boolean) => void;
  onStackUpdate?: (cardSet: {
    id: string;
    title: string;
    cards: Card[];
  }) => void;
}

export default function StackComponent({
  stack,
  cards,
  selectedCard,
  isEditMode,
  selectedCards,
  onCardSelect,
  onCheckboxChange,
  onStackUpdate,
}: StackProps) {
  const handleSave = async () => {
    try {
      const cardsList = stack.cardIds.map((id) => cards[id]);
      const savedCardSet = await cardsApi.save(stack.name, cardsList);
      if (onStackUpdate) {
        onStackUpdate(savedCardSet);
      }
    } catch (err) {
      console.error('Failed to save stack:', err);
    }
  };

  const stackFeatures = createStackBarFeatures(
    '/learnit',
    selectedCards.size,
    selectedCards,
  );

  // Override save action
  if (stackFeatures.save) {
    stackFeatures.save.action = handleSave;
  }

  return (
    <div className="flex flex-col gap-3.5 max-w-[25.688rem] ">
      {/* Stack Toolbar */}
      <Toolbar
        features={stackFeatures}
        content={null}
        spacing={[11, 1, 1]}
        className="h-[3.438rem]"
      />

      {/* Stack Area */}
      <div className="border-[1.5px] border-[#CCCCCC] dark:border-[#1c1c1c] rounded-[0.8rem] hst:rounded-none p-5 h-[30rem]">
        {/* Stack-Header */}

        <h4 className="text-lg font-semibold mb-3">{stack.name}</h4>
        <div className="w-full h-px bg-[#CCCCCC] mb-6" />

        {/* Cards List */}
        <div className="flex flex-col gap-5 overflow-y-auto h-[calc(100%-5rem)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500 [&::-webkit-scrollbar]{width:6px} [&::-webkit-scrollbar-thumb]{border-radius:9999px} pr-2">
          {stack.cardIds.map((cardId, index) => {
            const card = cards[cardId];
            return (
              <div
                key={card.id}
                className={cn(
                  'group flex items-center gap-4 cursor-pointer dark:hover:bg-light-primary/5 hover:bg-[#cccccc] px-4 py-2 rounded-md hst:rounded-none transition-colors text-dark-primary dark:text-light-primary',
                  selectedCard?.id === card.id &&
                    'bg-[#cccccc] dark:bg-light-primary/5 hst:bg-hst-accent hst:text-light-primary',
                )}
                onClick={() => onCardSelect(card)}
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onChange={(checked) => onCheckboxChange(card.id, checked)}
                    onClick={(e) => e.stopPropagation()}
                    label={`Select card ${index + 1}`}
                    hideWhenUnchecked={!isEditMode}
                    className="relative right-2"
                  />
                  <span className="text-base">{index + 1}</span>
                </div>
                <p className="text-sm flex-1 line-clamp-2">{card.front}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
