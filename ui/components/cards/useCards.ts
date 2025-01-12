import { useState, useEffect, useCallback } from 'react';
import { cardsApi } from '../shared/toolbar/actions/edit';
import type { CardData } from './Card';

interface UseCardsProps {
  mode: 'generate' | 'view';
  cardsId?: string;
  initialCards?: CardData[];
}

export const useCards = ({ mode, cardsId, initialCards = [] }: UseCardsProps) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reinitialize = useCallback((newCards: CardData[]) => {
    setCards(newCards);
  }, []);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        if (mode === 'view' && cardsId) {
          const loadedCards = await cardsApi.load(cardsId);
          setCards(loadedCards);
        } else if (mode === 'generate' && initialCards) {
          setCards(initialCards);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [mode, cardsId, initialCards]);

  const addCard = (card: CardData) => {
    setCards(prev => [...prev, card]);
  };

  const updateCard = (index: number, card: CardData) => {
    setCards(prev => {
      const newCards = [...prev];
      newCards[index] = card;
      return newCards;
    });
  };

  const removeCard = (index: number) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  return {
    cards,
    setCards,
    addCard,
    updateCard,
    removeCard,
    reinitialize,
    isLoading,
    error
  };
}; 