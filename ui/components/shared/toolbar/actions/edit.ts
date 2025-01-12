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
  load: async (summaryId: string): Promise<Summary> => {
    const response = await fetch(`/api/summaries/getSummary/${summaryId}`);
    if (!response.ok) {
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

  save: async (chatId: string, chatHistory: string): Promise<Summary> => {
    const response = await fetch('/api/summaries/createSummary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, chatHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to save summary');
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
  }
};

// API actions for cards
export const cardsApi = {
  load: async (stackId: string): Promise<Card[]> => {
    const response = await fetch(`/api/cards/getStack/${stackId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const cardSet: CardSet = await response.json();
    return cardSet.cards;
  },

  loadAll: async (): Promise<Stack[]> => {
    const response = await fetch('/api/cards/getAllStacks');
    if (!response.ok) {
      throw new Error('Failed to fetch stacks');
    }
    return response.json();
  },

  save: async (chatId: string, chatHistory: string): Promise<CardSet> => {
    const response = await fetch('/api/cards/createStack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, chatHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to save cards');
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
  }
};

// Toolbar actions
export const editActions = {
  summary: (content: string) => {
    window.location.href = `/texteditor?content=${encodeURIComponent(content)}`;
  },
  cards: (content: string) => {
    window.location.href = `/cardseditor?content=${encodeURIComponent(content)}`;
  }
}; 