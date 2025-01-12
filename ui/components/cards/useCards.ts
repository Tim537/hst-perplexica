import { useState, useEffect, useCallback } from 'react';
import { cardsApi } from '../shared/toolbar/actions/edit';
import type { CardData } from './Card';

interface UseCardsProps {
  mode: 'generate' | 'view';
  cardsId?: string;
  initialCards?: CardData[] | null;
}

export const useCards = ({ mode, cardsId, initialCards = [] }: UseCardsProps) => {
  const [cards, setCards] = useState<CardData[]>(initialCards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentCard = cards[currentIndex];
  const previousCard = currentIndex > 0 ? cards[currentIndex - 1] : null;
  const nextCard = currentIndex < cards.length - 1 ? cards[currentIndex + 1] : null;
  const totalCards = cards.length;

  const goToNextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setIsAnimating(false);
      }, 1200);
    }
  }, [currentIndex, cards.length]);

  const goToPrevCard = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(i => i - 1);
        setIsAnimating(false);
      }, 1200);
    }
  }, [currentIndex]);

  const reinitialize = useCallback((newCards: CardData[]) => {
    setCards(newCards);
    setCurrentIndex(0);
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

  return {
    cards,
    currentCard,
    previousCard,
    nextCard,
    goToNextCard,
    goToPrevCard,
    totalCards,
    currentIndex,
    direction,
    isAnimating,
    reinitialize,
    isLoading,
    error
  };
}; 