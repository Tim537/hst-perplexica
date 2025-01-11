'use client';

import { useState } from 'react';
import SummaryDialog from '@/components/summaries/summaryDialog';
import CardsDialog from '@/components/cards/cardsDialog';
import { parseCardsData } from '@/lib/utils';

// Example cards data
const EXAMPLE_CARDS = `{
id: 1,
front: "1 What is AI?",
back: "Künstliche Intelligenz beinhaltet Algorithmen und Modelle, die auf Daten trainiert werden, um bestimmte Aufgaben effizient zu erledigen. Diese Modelle können sich anhand von Beispielen verbessern und komplexe Probleme lösen"
}

{
id: 2,
front: "2 Welchen Arten von KI gibt es?",
back: "Es gibt verschiedene Formen der KI, darunter: 1. Niveaugestützte KI und 2. Generalistische KI"
}

{
id: 3,
front: "3 Was sind die gängste Trainingsmethoden?",
back: "1. Supervised Learning: Hierbei werden Algorithmen mit labeilerten Daten trainiert, um Muster zu erkennen."
}

{
id: 4,
front: "4 Welchen Arten von KI gibt es?",
back: "Es gibt verschiedene Formen der KI, darunter: Spezialisierte und Generalistische KI"
}

{
id: 5,
front: "5 Was ist Reinforcement Learning?",
back: "Reinforcement Learning ist eine Methode, bei der ein Agent lernt, wie er in einem Umgebung optimal zu handeln, indem es Belohnungen oder Strafen für bestimmte Aktionen erhält."
}`;

const Test = () => {
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isCardsOpen, setCardsOpen] = useState(false);

  // Parse example cards
  const cards = parseCardsData(EXAMPLE_CARDS);

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={() => setSummaryOpen(true)}
        className="bg-[#24A0ED] text-white px-4 py-2 rounded-lg hover:bg-opacity-85 transition duration-200"
      >
        Open Summary Dialog
      </button>

      <button
        onClick={() => setCardsOpen(true)}
        className="bg-[#24A0ED] text-white px-4 py-2 rounded-lg hover:bg-opacity-85 transition duration-200 block"
      >
        Open Cards Dialog
      </button>

      <SummaryDialog
        mode="generate"
        isOpen={isSummaryOpen}
        setIsOpen={setSummaryOpen}
        onGenerate={(content) => console.log('Generated summary:', content)}
      />

      <CardsDialog
        mode="generate"
        isOpen={isCardsOpen}
        setIsOpen={setCardsOpen}
        initialCards={cards}
      />
      <a href="/texteditor">
        <button className="bg-[#24A0ED] text-white px-4 py-2 rounded-lg hover:bg-opacity-85 transition duration-200 mt-4">
          Open Text Editor
        </button>
      </a>
    </div>
  );
};

export default Test;
