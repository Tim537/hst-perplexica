import { FC } from 'react';
import { motion } from 'framer-motion';

export interface CardData {
  id: string;
  front: string;
  back: string;
}

interface CardProps {
  card: CardData;
  position: 'prev' | 'current' | 'next';
  zIndex: number;
  direction: 'left' | 'right';
  isAnimating?: boolean;
}

/**
 * Animation variants for card positions and transitions
 * Each variant defines the position and animation properties for a card state
 *
 * Static positions:
 * - prev: Left side, slightly rotated and scaled down
 * - current: Center, no rotation, full scale
 * - next: Right side, slightly rotated and scaled down
 *
 * Animations (right direction):
 * - currentToPrev: Center card moves out to left
 * - nextToCurrent: Right card moves to center
 * - prevToNext: Left card moves to right
 *
 * Animations (left direction):
 * - prevToCurrent: Left card moves to center
 * - currentToNext: Center card moves to right
 * - nextToPrev: Right card moves to left
 */
const cardVariants = {
  prev: {
    x: -30,
    y: -15,
    rotate: -8,
    scale: 0.92,
    zIndex: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  current: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: 3,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  next: {
    x: 15,
    y: 8,
    rotate: 4,
    scale: 0.95,
    zIndex: 2,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  // Current card moving to prev (right direction)
  currentToPrev: {
    x: [0, 300, -30],
    y: [0, -80, -15],
    rotate: [0, 30, -8],
    scale: [1, 1, 0.92],
    zIndex: [3, 3, 1],
    transition: {
      duration: 1.2,
      times: [0, 0.5, 1],
      ease: [0.4, 0, 0.2, 1],
      zIndex: { delay: 0.9 },
    },
  },
  // Next card becoming current (right direction)
  nextToCurrent: {
    x: [15, 0],
    y: [8, 0],
    rotate: [4, 0],
    scale: [0.95, 1],
    zIndex: [2, 3],
    transition: {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1],
      delay: 0.1,
      zIndex: { delay: 0.6 },
    },
  },
  // Prev card becoming next (right direction)
  prevToNext: {
    x: [-30, 15],
    y: [-15, 8],
    rotate: [-8, 4],
    scale: [0.92, 0.95],
    zIndex: [1, 2],
    transition: {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1],
      delay: 0.1,
      zIndex: { delay: 0.6 },
    },
  },
  // Prev card becoming current (left direction - reverse play of currentToPrev)
  prevToCurrent: {
    x: [-30, 300, 0],
    y: [-15, -80, 0],
    rotate: [-8, 30, 0],
    scale: [0.92, 1, 1],
    zIndex: [1, 3, 3],
    transition: {
      duration: 1.2,
      times: [0, 0.5, 1],
      ease: [0.4, 0, 0.2, 1],
      zIndex: { delay: 0.1 },
    },
  },
  // Current card becoming next (left direction - reverse play of nextToCurrent)
  currentToNext: {
    x: [0, 15],
    y: [0, 8],
    rotate: [0, 4],
    scale: [1, 0.95],
    zIndex: [3, 2],
    transition: {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1],
      delay: 0.1,
      zIndex: { delay: 0.6 },
    },
  },
  // Next card becoming prev (left direction - reverse play of prevToNext)
  nextToPrev: {
    x: [15, -30],
    y: [8, -15],
    rotate: [4, -8],
    scale: [0.95, 0.92],
    zIndex: [2, 1],
    transition: {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1],
      delay: 0.1,
      zIndex: { delay: 0.6 },
    },
  },
};

/**
 * FlashCard Component
 * Renders a single card with animations based on its position and direction
 *
 * Animation Logic:
 * 1. When not animating, card stays in its static position (prev/current/next)
 * 2. During animation:
 *    - Right direction: current → prev, next → current, prev → next
 *    - Left direction: prev → current, current → next, next → prev
 * 3. Uses Framer Motion for smooth transitions between states
 */
export const FlashCard: FC<CardProps> = ({
  card,
  position,
  zIndex,
  direction,
  isAnimating,
}) => {
  const getAnimationVariant = () => {
    if (!isAnimating) return position;

    if (direction === 'right') {
      if (position === 'current') return 'currentToPrev';
      if (position === 'next') return 'nextToCurrent';
      if (position === 'prev') return 'prevToNext';
    } else if (direction === 'left') {
      if (position === 'prev') return 'prevToCurrent';
      if (position === 'current') return 'currentToNext';
      if (position === 'next') return 'nextToPrev';
    }
    return position;
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-[0.625rem] hst:rounded-none border-2 border-[#cccccc] bg-light-secondary dark:border-[#1C1C1C] dark:bg-[#111111]"
      variants={cardVariants}
      initial={position}
      animate={getAnimationVariant()}
      style={{
        transformOrigin: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="p-[1.375rem] text-dark-primary dark:text-light-primary h-full flex flex-col">
        <div className="text-[1rem]">{card.front}</div>
        <div className="my-4 border-t-2 dark:border-[#1C1C1C] border-[#cccccc]" />
        <div className="text-[0.875rem]">{card.back}</div>
      </div>
    </motion.div>
  );
};
