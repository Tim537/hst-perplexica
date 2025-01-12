'use client';

import { useState } from 'react';
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

// Sample data - replace with actual data from DB
const sampleStack: Stack = {
  id: '1',
  name: 'Sample Stack',
  cardIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
};

const sampleCards: Record<string, Card> = {
  '1': {
    id: '1',
    front: 'What is artificial intelligence?',
    back: 'Artificial intelligence (AI) is the simulation of human intelligence by machines.',
  },
  '2': {
    id: '2',
    front:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    back: 'Sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
  },
  '3': {
    id: '3',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '4': {
    id: '4',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '5': {
    id: '5',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '6': {
    id: '6',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '7': {
    id: '7',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '8': {
    id: '8',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
  '9': {
    id: '9',
    front: 'What are neural networks?',
    back: 'Neural networks are computing systems inspired by biological neural networks that form animal brains.',
  },
};

export default function CardsEditorPage() {
  const [selectedField, setSelectedField] = useState<'front' | 'back'>('front');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleCardSelect = (card: Card): void => {
    setSelectedCard(card);
    frontEditor?.commands.setContent(card.front);
    backEditor?.commands.setContent(card.back);
  };

  const handleCheckboxChange = (cardId: string, checked: boolean) => {
    const newSelected = new Set(selectedCards);
    if (checked) {
      newSelected.add(cardId);
      if (!isEditMode) setIsEditMode(true);
    } else {
      newSelected.delete(cardId);
      if (newSelected.size === 0) setIsEditMode(false);
    }
    setSelectedCards(newSelected);
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
  }) as EditorWithExtensions | null;

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
  }) as EditorWithExtensions | null;

  return (
    <div className="flex items-start p-[3.688rem] gap-2 h-fit flex-wrap lg:flex-nowrap">
      <StackComponent
        stack={sampleStack}
        cards={sampleCards}
        selectedCard={selectedCard}
        isEditMode={isEditMode}
        selectedCards={selectedCards}
        onCardSelect={handleCardSelect}
        onCheckboxChange={handleCheckboxChange}
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
