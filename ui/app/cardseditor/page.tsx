'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { EditorWithExtensions } from '@/components/shared/toolbar/types/editor';
import { Card, Stack } from '@/components/cards/types';
import StackComponent from '@/components/cards/Stack';
import CardEditor from '@/components/cards/CardEditor';
import { cardsApi } from '@/components/shared/toolbar/actions/edit';

export default function CardsEditorPage() {
  const searchParams = useSearchParams();
  const stackId = searchParams.get('id');
  const content = searchParams.get('content');

  const [stack, setStack] = useState<Stack | null>(null);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stack data or initialize from content
  useEffect(() => {
    const initializeStack = async () => {
      try {
        setIsLoading(true);

        if (stackId) {
          // Load existing stack
          const loadedCards = await cardsApi.load(stackId);
          const cardsMap: Record<string, Card> = {};
          const cardIds: string[] = [];

          loadedCards.forEach((card) => {
            cardsMap[card.id] = card;
            cardIds.push(card.id);
          });

          setCards(cardsMap);
          setStack({
            id: stackId,
            name: 'Loaded Stack',
            cardIds: cardIds,
          });
        } else if (content) {
          // Initialize new stack from content
          try {
            const initialCards = JSON.parse(content) as Card[];
            const cardsMap: Record<string, Card> = {};
            const cardIds: string[] = [];

            initialCards.forEach((card) => {
              cardsMap[card.id] = card;
              cardIds.push(card.id);
            });

            setCards(cardsMap);
            setStack({
              id: 'new',
              name: 'New Stack',
              cardIds: cardIds,
            });
          } catch (parseErr) {
            console.error('Failed to parse content:', parseErr);
            setError('Invalid card data');
          }
        } else {
          // New empty stack
          setStack({
            id: 'new',
            name: 'New Stack',
            cardIds: [],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stack');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStack();
  }, [stackId, content]);

  const handleSave = async () => {
    if (!stack) return;

    try {
      const cardsList = stack.cardIds.map((id) => cards[id]);
      const savedCardSet = await cardsApi.save(stack.name, cardsList);

      // Update local state with saved data
      const cardsMap: Record<string, Card> = {};
      const cardIds: string[] = [];

      savedCardSet.cards.forEach((card) => {
        cardsMap[card.id] = card;
        cardIds.push(card.id);
      });

      setCards(cardsMap);
      setStack((prev) =>
        prev
          ? {
              ...prev,
              id: savedCardSet.id,
              name: savedCardSet.title,
              cardIds,
            }
          : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save stack');
    }
  };

  const frontEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: selectedCard?.front || '',
    editable: true,
  }) as EditorWithExtensions;

  const backEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: selectedCard?.back || '',
    editable: true,
  }) as EditorWithExtensions;

  const [selectedField, setSelectedField] = useState<'front' | 'back'>('front');

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    frontEditor?.commands.setContent(card.front);
    backEditor?.commands.setContent(card.back);
  };

  const handleCheckboxChange = (cardId: string, checked: boolean) => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(cardId);
      } else {
        newSet.delete(cardId);
      }
      return newSet;
    });
  };

  const handleStackUpdate = async (cardSet: {
    id: string;
    title: string;
    cards: Card[];
  }) => {
    const cardsMap: Record<string, Card> = {};
    const cardIds: string[] = [];

    cardSet.cards.forEach((card) => {
      cardsMap[card.id] = card;
      cardIds.push(card.id);
    });

    setCards(cardsMap);
    setStack((prev) => (prev ? { ...prev, cardIds } : null));
  };

  if (isLoading) {
    return <div>Loading stack...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 flex justify-center items-center h-screen">
        {error}
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="text-red-500 flex justify-center items-center h-screen">
        No stack found
      </div>
    );
  }

  return (
    <div className="flex items-start p-[3.688rem] gap-2 h-fit flex-wrap lg:flex-nowrap">
      <StackComponent
        stack={stack}
        cards={cards}
        selectedCard={selectedCard}
        isEditMode={isEditMode}
        selectedCards={selectedCards}
        onCardSelect={handleCardSelect}
        onCheckboxChange={handleCheckboxChange}
        onStackUpdate={handleStackUpdate}
      />

      <CardEditor
        frontEditor={frontEditor}
        backEditor={backEditor}
        selectedField={selectedField}
        onFieldSelect={setSelectedField}
      />
    </div>
  );
}
