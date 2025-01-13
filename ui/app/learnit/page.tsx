'use client';

import { useEffect, useState } from 'react';
import { Pencil, FileText, Layers, Trash2 } from 'lucide-react';
import SummaryDialog from '@/components/summaries/summaryDialog';
import CardsDialog from '@/components/cards/cardsDialog';
import { Card } from '@/components/cards/types';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'summaries' | 'flashcards';
interface Summary {
  id: string;
  content: string;
  chatTitle: string;
  chat: string;
}

interface Stack {
  id: string;
  title: string;
  chat: string;
  cards: Card[];
}

export default function LearnitPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const showSummaries = activeFilter === 'all' || activeFilter === 'summaries';
  const showStacks = activeFilter === 'all' || activeFilter === 'flashcards';

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [stacks, setStacks] = useState<Stack[]>([]);

  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);

  const [isCardsDialogOpen, setIsCardsDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/summaries/listSummaries`,
        );
        if (!response.ok) throw new Error('Failed to fsetch summaries');
        const data = await response.json();

        // Fetch the chat titles
        const summariesWithTitles = await Promise.all(
          data.summaries.map(async (summary: any) => {
            const titleResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/chats/title/${summary.chat}`,
            );
            const { title } = await titleResponse.json();
            return {
              ...summary,
              chatTitle: title,
            };
          }),
        );

        setSummaries(summariesWithTitles);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      }
    };

    fetchSummaries();
  }, []);

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cards/listAllStacks`,
        );
        if (!response.ok) throw new Error('Failed to fetch stacks');
        const data = await response.json();

        // Fetch the chat titles
        const stacksWithTitles = await Promise.all(
          data.map(async (stack: any) => {
            const titleResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/chats/title/${stack.chat}`,
            );
            const { title } = await titleResponse.json();
            return { ...stack, chatTitle: title };
          }),
        );

        setStacks(stacksWithTitles);
      } catch (error) {
        console.error('Error fetching stacks:', error);
      }
    };
    fetchStacks();
  }, []);

  const handleDeleteStack = async (stackId: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cards/${stackId}/deleteStack`,
      {
        method: 'DELETE',
      },
    );
    setStacks(stacks.filter((s) => s.id !== stackId));
  };

  const handleDeleteSummary = async (summaryId: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/summaries/${summaryId}/deleteSummary`,
      {
        method: 'DELETE',
      },
    );
    setSummaries(summaries.filter((s) => s.id !== summaryId));
  };

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
              {summaries.map((summary: Summary) => (
                <div
                  key={summary.id}
                  className="p-4 border rounded-lg dark:border-dark-200 hover:border-[#24A0ED] dark:hover:border-[#24A0ED] transition-colors cursor-pointer group"
                  onClick={() => {
                    setIsSummaryDialogOpen(true);
                    setSelectedSummary(summary);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      {(summary.chatTitle || 'Untitled').slice(0, 25)}
                      {(summary.chatTitle?.length || 0) > 25 ? '...' : ''}
                    </h3>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      aria-label={`Delete Stack Title`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        handleDeleteSummary(summary.id);
                      }}
                    >
                      <Trash2 className="w-4 h-5 text-red-500" />
                    </button>
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
              {stacks.map((stack: any) => (
                <div
                  key={stack.id}
                  className="p-4 border rounded-lg dark:border-dark-200 hover:border-[#24A0ED] dark:hover:border-[#24A0ED] transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedStack(stack);
                    setIsCardsDialogOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      {(stack.chatTitle || 'Untitled').slice(0, 25)}
                      {(stack.chatTitle?.length || 0) > 25 ? '...' : ''}
                    </h3>

                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      aria-label={`Delete Stack Title`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        handleDeleteStack(stack.id);
                      }}
                    >
                      <Trash2 className="w-4 h-5 text-red-500" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {stack.cards.length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <CardsDialog
        isOpen={isCardsDialogOpen}
        setIsOpen={setIsCardsDialogOpen}
        mode="view"
        cardsId={selectedStack?.id || ''}
        stackId={Number(selectedStack?.id) || 0}
      />
      <SummaryDialog
        isOpen={isSummaryDialogOpen}
        setIsOpen={setIsSummaryDialogOpen}
        mode="view"
        summary={selectedSummary?.content || ''}
        summaryId={selectedSummary?.id || ''}
        chatId={selectedSummary?.chat || ''}
      />
    </div>
  );
}
