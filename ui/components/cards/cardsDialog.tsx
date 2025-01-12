import { FC, Fragment, useEffect } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Toolbar from '@/components/shared/toolbar/Toolbar';
import { createCardsDialogFeatures } from '@/components/shared/toolbar/features/dialogBars';
import { FlashCard, type CardData } from './Card';
import { useCards } from './useCards';
import Tooltip from '@/components/shared/Tooltip';
import { motion } from 'framer-motion';

interface CardsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mode: 'view' | 'generate';
  initialCards?: CardData[];
}

/**
 * CardsDialog Component
 * Displays a modal dialog with an interactive flashcard stack
 *
 * Features:
 * - Shows three cards at a time (previous, current, next)
 * - Handles card navigation with animations
 * - Prevents navigation during animations
 * - Maintains card stack state and position
 *
 * Card Stack Layout:
 * - Previous card: Left side, smaller scale
 * - Current card: Center, full scale
 * - Next card: Right side, smaller scale
 *
 * Navigation:
 * - Left arrow: Move to previous card
 * - Right arrow: Move to next card
 * - Animations handle smooth transitions between states
 */
const CardsDialog: FC<CardsDialogProps> = ({
  isOpen,
  setIsOpen,
  mode,
  initialCards = [],
}) => {
  console.log('CardsDialog - Initial Cards:', initialCards);

  const {
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
  } = useCards({ initialCards });

  useEffect(() => {
    console.log('Cards changed, reinitializing...', initialCards);
    reinitialize(initialCards);
  }, [initialCards, reinitialize]);

  console.log('CardsDialog - Current Card:', currentCard);
  console.log('CardsDialog - Previous Card:', previousCard);
  console.log('CardsDialog - Next Card:', nextCard);

  /**
   * Handlers for card navigation
   * Prevent multiple clicks during animation
   */
  const handleNextCard = () => {
    if (isAnimating) return;
    goToNextCard();
  };

  const handlePrevCard = () => {
    if (isAnimating) return;
    goToPrevCard();
  };

  const features = createCardsDialogFeatures(mode === 'generate');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-light-primary/50 dark:bg-dark-primary/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-200"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-[47.938rem] transform flex flex-col justify-between rounded-[1.25rem] hst:rounded-none bg-light-primary dark:bg-dark-primary border border-[#E7E7E7] dark:border-dark-200 p-6 text-left align-middle shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.25)] transition-all">
                {/* Dialog header */}
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-medium text-dark-primary dark:text-light-primary">
                    {mode === 'generate' ? 'Generate Cards' : 'View Cards'}
                  </DialogTitle>
                  <Tooltip text="Close" spacing="0.5rem">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-[#757573] hover:text-[#454545] dark:hover:text-white hst:text-white/70 hst:hover:text-white/40 transition-colors"
                      aria-label="Close dialog"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Tooltip>
                </div>

                {/* Cards content area */}
                <div className="relative w-full h-fit mt-6">
                  <div className="mt-[3rem] mb-0 inset-0 flex items-center justify-center">
                    {/* Card Stack Container */}
                    <div className="relative w-[27.688rem] h-[18.750rem]">
                      {/* Previous Card */}
                      {previousCard && (
                        <FlashCard
                          key={`prev-${previousCard.id}`}
                          card={previousCard}
                          position="prev"
                          zIndex={1}
                          direction={direction}
                          isAnimating={isAnimating}
                        />
                      )}

                      {/* Current Card */}
                      {currentCard && (
                        <FlashCard
                          key={`current-${currentCard.id}`}
                          card={currentCard}
                          position="current"
                          zIndex={3}
                          direction={direction}
                          isAnimating={isAnimating}
                        />
                      )}

                      {/* Next Card */}
                      {nextCard && (
                        <FlashCard
                          key={`next-${nextCard.id}`}
                          card={nextCard}
                          position="next"
                          zIndex={2}
                          direction={direction}
                          isAnimating={isAnimating}
                        />
                      )}

                      {/* Navigation Buttons */}
                      <motion.button
                        onClick={handlePrevCard}
                        disabled={isAnimating}
                        className="absolute -left-5  z-10 p-2 top-1/2 rounded-full bg-[#24A0ED] hst:bg-hst-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous card"
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft className="w-6 h-6 text-light-primary" />
                      </motion.button>

                      <motion.button
                        onClick={handleNextCard}
                        disabled={isAnimating}
                        className="absolute -right-5 top-1/2 z-10 p-2 rounded-full bg-[#24A0ED] hst:bg-hst-accent  disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next card"
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="w-6 h-6 text-light-primary" />
                      </motion.button>

                      {/* Card Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-dark-secondary dark:text-light-secondary bg-light-primary/80 dark:bg-dark-primary/80 px-2 py-1 rounded">
                        {currentIndex + 1} / {totalCards}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="mt-[3rem] flex justify-center w-full">
                  <div className="flex">
                    <Toolbar
                      features={features}
                      content={currentCard}
                      spacing={[1.5, 1.5]}
                    />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CardsDialog;
