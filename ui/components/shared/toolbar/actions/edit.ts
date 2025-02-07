import type { Card } from '../../../cards/types';

interface Summary {
  id: string;
  title: string;
  content: string;
}

interface CardSet {
  id: string;
  title: string;
  cards: Card[];
}

interface Stack {
  id: string;
  title: string;
}

// API actions for summaries
export const summaryApi = {
  load: async (chatId: string): Promise<Summary> => {
    const response = await fetch(
      `http://localhost:3001/api/summaries/${chatId}/getSummary`,
    );
    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to fetch summary');
    }
    return response.json();
  },

  loadAll: async (): Promise<Summary[]> => {
    const response = await fetch('/api/summaries/getAllSummaries');
    if (!response.ok) {
      throw new Error('Failed to fetch summaries');
    }
    return response.json();
  },

  
  delete: async (summaryId: string): Promise<void> => {
    const response = await fetch(`/api/summaries/deleteSummary/${summaryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete summary');
    }
  },
};

// API actions for cards
export const cardsApi = {
  load: async (stackId: string): Promise<Card[]> => {
    const response = await fetch(
      `http://localhost:3001/api/cards/${stackId}/getStackById`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const cardSet: CardSet = await response.json();
    return cardSet.cards;
  },

  loadAll: async (): Promise<Stack[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cards/getAllStacks`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stacks');
    }
    return response.json();
  },


  delete: async (stackId: string): Promise<void> => {
    const response = await fetch(`/api/cards/deleteStack/${stackId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete stack');
    }
  },
};

// Toolbar actions
export const editActions = {
  summary: (summaryId: number) => {
    window.location.href = `/texteditor/summary/${summaryId}`;
  },
  cards: (stackId: number) => {
    window.location.href = `/cardseditor/stack/${stackId}`;
  },
};
