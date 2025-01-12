'use client';

import { useEffect, useState } from 'react';
import { Pencil, FileText, Layers, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SummaryDialog from '@/components/summaries/summaryDialog';
import CardsDialog from '@/components/cards/cardsDialog';
import { Card } from '@/components/cards/types';
import { cn } from '@/lib/utils';
import {
  editActions,
  summaryApi,
  cardsApi,
} from '@/components/shared/toolbar/actions/edit';

interface Summary {
  id: string;
  title: string;
  content: string;
}

interface Stack {
  id: string;
  title: string;
  cards: Card[];
}

type FilterType = 'all' | 'summaries' | 'flashcards';

export default function LearnitPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isCardsDialogOpen, setIsCardsDialogOpen] = useState(false);

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // In reality, these would be separate API endpoints
        // For now, we'll use our existing endpoints
        const [loadedSummaries, loadedStacks] = await Promise.all([
          summaryApi.loadAll(), // This needs to be added to the API
          cardsApi.loadAll(), // This needs to be added to the API
        ]);

        setSummaries(loadedSummaries);
        setStacks(loadedStacks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const showSummaries = activeFilter === 'all' || activeFilter === 'summaries';
  const showStacks = activeFilter === 'all' || activeFilter === 'flashcards';

  const handleEditSummary = (summaryId: string) => {
    const summary = summaries.find((s) => s.id === summaryId);
    if (summary) {
      editActions.summary(summary.content);
    }
  };

  const handleEditStack = (stackId: string) => {
    router.push(`/cardseditor?id=${stackId}`);
  };

  const handleDeleteSummary = async (summaryId: string) => {
    try {
      await summaryApi.delete(summaryId); // This needs to be added to the API
      setSummaries((prev) => prev.filter((s) => s.id !== summaryId));
    } catch (err) {
      console.error('Failed to delete summary:', err);
    }
  };

  const handleDeleteStack = async (stackId: string) => {
    try {
      await cardsApi.delete(stackId); // This needs to be added to the API
      setStacks((prev) => prev.filter((s) => s.id !== stackId));
    } catch (err) {
      console.error('Failed to delete stack:', err);
    }
  };

  const handleCardsDialogClose = (open: boolean) => {
    setIsCardsDialogOpen(open);
    if (!open) {
      setSelectedStack(null);
    }
  };

  // Get the cards for the selected stack
  const selectedStackCards = selectedStack
    ? stacks.find((s) => s.id === selectedStack)?.cards || []
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

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
              {summaries.map((summary) => (
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
              {stacks.map((stack) => (
                <div
                  key={stack.id}
                  className="p-4 border rounded-lg dark:border-dark-200 hover:border-[#24A0ED] dark:hover:border-[#24A0ED] transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedStack(stack.id);
                    setIsCardsDialogOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{stack.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStack(stack.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Edit ${stack.title}`}
                      >
                        <Pencil className="w-4 h-4 text-[#24A0ED]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStack(stack.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        aria-label={`Delete ${stack.title}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {stack.cards.length} cards
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
