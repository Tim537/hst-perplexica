'use client';

import { useState } from 'react';
import { Pencil, FileText, Layers, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SummaryDialog from '@/components/summaries/summaryDialog';
import CardsDialog from '@/components/cards/cardsDialog';
import { CardData } from '@/components/cards/Card';
import { cn } from '@/lib/utils';
import { editActions } from '@/components/shared/toolbar/actions';

// Sample data - replace with actual data from DB
const sampleSummaries = [
  {
    id: '1',
    title: 'Introduction to AI',
    content: 'AI is a fascinating field...',
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    content: 'ML is a subset of AI...',
  },
];

const sampleCards: Record<number, CardData> = {
  1: {
    id: 1,
    front: 'What is AI?',
    back: 'Artificial Intelligence is the simulation of human intelligence by machines.',
  },
  2: {
    id: 2,
    front: 'What is Machine Learning?',
    back: 'Machine Learning is a subset of AI that enables systems to learn from data.',
  },
  3: {
    id: 3,
    front: 'What is Deep Learning?',
    back: 'Deep Learning is a type of Machine Learning using neural networks with multiple layers.',
  },
  4: {
    id: 4,
    front: 'What is Supervised Learning?',
    back: 'A type of ML where the model learns from labeled training data.',
  },
  5: {
    id: 5,
    front: 'What is Unsupervised Learning?',
    back: 'A type of ML where the model finds patterns in unlabeled data.',
  },
  6: {
    id: 6,
    front: 'What is Reinforcement Learning?',
    back: 'A type of ML where an agent learns to make decisions by interacting with an environment.',
  },
};

const sampleStacks = [
  { id: '1', name: 'AI Flashcards', cardIds: [1, 2, 3] },
  { id: '2', name: 'ML Concepts', cardIds: [4, 5, 6] },
];

type FilterType = 'all' | 'summaries' | 'flashcards';

export default function LearnitPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isCardsDialogOpen, setIsCardsDialogOpen] = useState(false);

  const showSummaries = activeFilter === 'all' || activeFilter === 'summaries';
  const showStacks = activeFilter === 'all' || activeFilter === 'flashcards';

  const handleEditSummary = (summaryId: string) => {
    const summary = sampleSummaries.find((s) => s.id === summaryId);
    if (summary) {
      editActions.summary(summary.content);
    }
  };

  const handleEditStack = (stackId: string) => {
    router.push(`/cardseditor?id=${stackId}`);
  };

  const handleDeleteSummary = (summaryId: string) => {
    // TODO: Implement actual deletion
    console.log('Deleting summary:', summaryId);
  };

  const handleDeleteStack = (stackId: string) => {
    // TODO: Implement actual deletion
    console.log('Deleting stack:', stackId);
  };

  const handleCardsDialogClose = (open: boolean) => {
    setIsCardsDialogOpen(open);
    if (!open) {
      setSelectedStack(null);
    }
  };

  // Get the cards for the selected stack
  const selectedStackCards = selectedStack
    ? (() => {
        const stack = sampleStacks.find((s) => s.id === selectedStack);
        if (stack) {
          return stack.cardIds.map((id) => sampleCards[id]);
        }
        return [];
      })()
    : [];

  return (
    <div className="p-8">
      {/* Filter Bar */}
      <div className="flex justify-center gap-6 mb-8 border-b pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            'px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 hover:bg-[#24A0ED]/5',
            activeFilter === 'all' && 'bg-[#24A0ED] text-white scale-105',
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('summaries')}
          className={cn(
            'px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 hover:bg-[#24A0ED]/5',
            activeFilter === 'summaries' && 'bg-[#24A0ED] text-white scale-105',
          )}
        >
          <FileText className="w-4 h-4" />
          Summaries
        </button>
        <button
          onClick={() => setActiveFilter('flashcards')}
          className={cn(
            'px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 hover:bg-[#24A0ED]/5',
            activeFilter === 'flashcards' &&
              'bg-[#24A0ED] text-white scale-105',
          )}
        >
          <Layers className="w-4 h-4" />
          Flashcards
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {/* Summaries Section */}
        {showSummaries && (
          <div>
            {activeFilter === 'summaries' && (
              <h2 className="text-xl font-semibold mb-4">Summaries</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="p-4 border rounded-lg dark:border-dark-200 hover:border-[#24A0ED] dark:hover:border-[#24A0ED] transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedSummary(summary.id);
                    setIsSummaryDialogOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{summary.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSummary(summary.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Edit ${summary.title}`}
                      >
                        <Pencil className="w-4 h-4 text-[#24A0ED]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSummary(summary.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Delete ${summary.title}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stacks Section */}
        {showStacks && (
          <div>
            {activeFilter === 'flashcards' && (
              <h2 className="text-xl font-semibold mb-4">Flashcard Stacks</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleStacks.map((stack) => (
                <div
                  key={stack.id}
                  className="p-4 border rounded-lg dark:border-dark-200 hover:border-[#24A0ED] dark:hover:border-[#24A0ED] transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedStack(stack.id);
                    setIsCardsDialogOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{stack.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStack(stack.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Edit ${stack.name}`}
                      >
                        <Pencil className="w-4 h-4 text-[#24A0ED]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStack(stack.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Delete ${stack.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {stack.cardIds.length} cards
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SummaryDialog
        isOpen={isSummaryDialogOpen}
        setIsOpen={setIsSummaryDialogOpen}
        mode="view"
        summaryId={selectedSummary || undefined}
      />

      <CardsDialog
        isOpen={isCardsDialogOpen}
        setIsOpen={handleCardsDialogClose}
        mode="view"
        initialCards={selectedStackCards}
      />
    </div>
  );
}
