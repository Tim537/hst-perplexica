import { useState, useCallback } from 'react';
import type { CardData } from './Card';
import { parseCardsData } from '../../lib/utils';

interface CardsState {
  cards: Record<number, CardData>;     // Map of card ID to card data
  currentId: number;                   // ID of currently displayed card
  orderedIds: number[];               // Order of card IDs for navigation
  direction: 'left' | 'right';        // Current animation direction
  isAnimating: boolean;               // Whether cards are currently animating
}

interface UseCardsProps {
  initialCards?: CardData[];
}

/**
 * Custom hook for managing flashcard state and animations
 * 
 * @param initialCards - Array of cards to initialize the state with
 */	
export const useCards = ({ initialCards = [] }: UseCardsProps) => {
  const [state, setState] = useState<CardsState>(() => {
    const cards = initialCards.reduce((acc, card) => {
      acc[card.id] = card;
      return acc;
    }, {} as Record<number, CardData>);

    const orderedIds = initialCards.map(card => card.id);
    
    return {
      cards,
      orderedIds,
      currentId: orderedIds[0] || 0,
      direction: 'right',
      isAnimating: false
    };
  });

  const setIsAnimating = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isAnimating: value }));
  }, []);

  /**
   * Navigation handler for moving to next card
   * 1. Checks if animation is in progress
   * 2. Sets direction to 'right' and starts animation
   * 3. After animation completes, updates current card
   */
  const goToNextCard = useCallback(() => {
    if (state.isAnimating) return;

    setState(prev => ({ ...prev, isAnimating: true, direction: 'right' }));

    const timer = setTimeout(() => {
      setState(prev => {
        const currentIndex = prev.orderedIds.indexOf(prev.currentId);
        const nextIndex = (currentIndex + 1) % prev.orderedIds.length;
        return {
          ...prev,
          currentId: prev.orderedIds[nextIndex],
          isAnimating: false
        };
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [state.isAnimating]);

  /**
   * Navigation handler for moving to previous card
   * 1. Checks if animation is in progress
   * 2. Sets direction to 'left' and starts animation
   * 3. After animation completes, updates current card
   */
  const goToPrevCard = useCallback(() => {
    if (state.isAnimating) return;

    setState(prev => ({ ...prev, isAnimating: true, direction: 'left' }));

    // Schedule the card change after animation duration
    const timer = setTimeout(() => {
      setState(prev => {
        const currentIndex = prev.orderedIds.indexOf(prev.currentId);
        const prevIndex = (currentIndex - 1 + prev.orderedIds.length) % prev.orderedIds.length;
        return {
          ...prev,
          currentId: prev.orderedIds[prevIndex],
          isAnimating: false
        };
      });
    }, 1200); // Match animation duration

    return () => clearTimeout(timer);
  }, [state.isAnimating]);

  // Calculate indices for adjacent cards
  const currentIndex = state.orderedIds.indexOf(state.currentId);
  const totalCards = state.orderedIds.length;
  
  // Always maintain consistent physical positions
  const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
  const nextIndex = (currentIndex + 1) % totalCards;

  // Get card data for current and adjacent positions
  const currentCard = state.cards[state.currentId];
  const previousCard = state.cards[state.orderedIds[prevIndex]];
  const nextCard = state.cards[state.orderedIds[nextIndex]];

  return {
    currentCard,
    previousCard,
    nextCard,
    goToNextCard,
    goToPrevCard,
    totalCards: state.orderedIds.length,
    currentIndex,
    direction: state.direction,
    isAnimating: state.isAnimating
  };
}; 