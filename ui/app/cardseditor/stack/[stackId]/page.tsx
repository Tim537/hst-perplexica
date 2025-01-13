'use client';

import { useEffect, useState, useRef } from 'react';
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

export default function CardsEditorPage({
  params,
}: {
  params: { stackId: string };
}) {
  const [stackId, setStackId] = useState<string>(params.stackId);

  const [stack, setStack] = useState<Stack | null>(null);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // important for the card editor
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Save content to backend
  const saveContent = async (
    cardId: string,
    field: 'front' | 'back',
    content: string,
  ) => {
    try {
      const card = cards[cardId];
      const updatedCard = {
        ...card,
        [field]: content,
      };

      const response = await fetch(
        `http://localhost:3001/api/cards/${cardId}/updateCard`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            front: updatedCard.front,
            back: updatedCard.back,
          }),
        },
      );

      if (!response.ok) {
        console.error('Failed to save changes');
        return;
      }

      // Update local state
      setCards((prev) => ({
        ...prev,
        [cardId]: updatedCard,
      }));
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // fetch stack data
  useEffect(() => {
    const fetchStack = async () => {
      const stack = await cardsApi.load(stackId);

      console.log('stack');
      console.log(stack);

      const cardsMap: Record<string, Card> = {};
      const cardIds: string[] = [];

      stack.forEach((card) => {
        cardsMap[card.id] = card;
        cardIds.push(card.id);
      });

      setCards(cardsMap);
      setStack({
        id: stackId,
        name: 'Loaded Stack',
        cardIds: cardIds,
      });
      setIsLoading(false);
    };
    fetchStack();
  }, [stackId]);

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
    onUpdate: ({ editor }) => {
      if (!selectedCard) return;
      const content = editor.getHTML();

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout to save after 1 second of no typing
      saveTimeoutRef.current = setTimeout(() => {
        saveContent(selectedCard.id, 'front', content);
      }, 1000);
    },
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
    onUpdate: ({ editor }) => {
      if (!selectedCard) return;
      const content = editor.getHTML();

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout to save after 1 second of no typing
      saveTimeoutRef.current = setTimeout(() => {
        saveContent(selectedCard.id, 'back', content);
      }, 1000);
    },
  }) as EditorWithExtensions;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
