'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const loadingCards = [
  {
    front: (
      <div className="h-4 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-3/4 animate-pulse hst:rounded-none"></div>
    ),
    back: (
      <div className="space-y-2">
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-full animate-pulse hst:rounded-none"></div>
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-4/5 animate-pulse hst:rounded-none"></div>
      </div>
    ),
  },
  {
    front: (
      <div className="h-4 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-2/3 animate-pulse hst:rounded-none"></div>
    ),
    back: (
      <div className="space-y-2">
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-5/6 animate-pulse hst:rounded-none"></div>
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-3/4 animate-pulse hst:rounded-none"></div>
      </div>
    ),
  },
  {
    front: (
      <div className="h-4 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-4/5 animate-pulse hst:rounded-none"></div>
    ),
    back: (
      <div className="space-y-2">
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-full animate-pulse hst:rounded-none"></div>
        <div className="h-3 bg-[#cccccc] dark:bg-[#1C1C1C] rounded w-2/3 animate-pulse hst:rounded-none"></div>
      </div>
    ),
  },
];

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
  prevToNext: {
    x: [-30, 15],
    y: [-15, 8],
    rotate: [-8, 4],
    scale: [0.92, 0.95],
    zIndex: [1, 2],
    transition: {
      ease: [0.32, 0.72, 0, 1],
      delay: 0.1,
      zIndex: { delay: 0.6 },
    },
  },
};

export const CardsLoader = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getAnimationVariant = (position: 'prev' | 'current' | 'next') => {
    if (!isAnimating) {
      return position;
    }

    const transitions = {
      current: 'currentToPrev',
      next: 'nextToCurrent',
      prev: 'prevToNext',
    };
    return transitions[position];
  };

  useEffect(() => {
    const animate = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex((prev) => (prev + 1) % loadingCards.length);
      }, 1200);
    };

    animate();
    const interval = setInterval(animate, 1800);
    return () => clearInterval(interval);
  }, []);

  const getCardIndex = (position: 'prev' | 'current' | 'next') => {
    const indexes = {
      prev: (currentIndex - 1 + loadingCards.length) % loadingCards.length,
      current: currentIndex,
      next: (currentIndex + 1) % loadingCards.length,
    };
    return indexes[position];
  };

  return (
    <div className="relative w-[27.688rem] h-[18.750rem] mx-auto">
      {(['prev', 'current', 'next'] as const).map((position) => (
        <motion.div
          key={`${position}-${getCardIndex(position)}`}
          className="absolute inset-0 rounded-[0.625rem] hst:rounded-none border-2 border-[#cccccc] bg-light-secondary dark:border-[#1C1C1C] dark:bg-[#111111]"
          initial={position}
          animate={getAnimationVariant(position)}
          variants={cardVariants}
          style={{
            transformOrigin: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="p-[1.375rem] h-full flex flex-col">
            <div className="text-[1rem] text-dark-primary dark:text-light-primary mb-4">
              {loadingCards[getCardIndex(position)].front}
            </div>
            <div className="my-4 border-t-2 dark:border-[#1C1C1C] border-[#cccccc]" />
            <div className="text-[0.875rem] text-dark-primary dark:text-light-primary">
              {loadingCards[getCardIndex(position)].back}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
