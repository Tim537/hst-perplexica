import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CardData } from '../components/cards/Card';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const formatTimeDifference = (
  date1: Date | string,
  date2: Date | string,
): string => {
  date1 = new Date(date1);
  date2 = new Date(date2);

  const diffInSeconds = Math.floor(
    Math.abs(date2.getTime() - date1.getTime()) / 1000,
  );

  if (diffInSeconds < 60)
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
  else if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) !== 1 ? 's' : ''}`;
  else if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) !== 1 ? 's' : ''}`;
  else if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) !== 1 ? 's' : ''}`;
  else
    return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) !== 1 ? 's' : ''}`;
};

/**
 * Parses raw text into an array of CardData objects
 * 
 * @param rawText - The raw text to parse
 * @returns An record of CardData objects
 */
export const parseCardsData = (rawText: string): CardData[] => {
  const cards: CardData[] = [];
  const cardBlocks = rawText.split('\n\n');
  
  for (const block of cardBlocks) {
    if (!block.trim()) continue;
    
    const idMatch = block.match(/id:\s*(\d+)/);
    const frontMatch = block.match(/front:\s*"([^"]*)"/);
    const backMatch = block.match(/back:\s*"([^"]*)"/);
    
    if (idMatch && frontMatch && backMatch) {
      cards.push({
        id: parseInt(idMatch[1]),
        front: frontMatch[1].trim(),
        back: backMatch[1].trim()
      });
    }
  }
  
  return cards;
};

/**
 * Creates spacing between elements using non-breaking spaces
 * @param elements Array of elements or text to be spaced
 * @param pattern Array of spacing values between elements
 * @param leadingSpaces Number of spaces to add before the first element
 * @returns Object containing the spaced string and element positions
 */
export const createElementSpacing = <T>(
  elements: T[],
  pattern: number[],
  leadingSpaces: number = 0,
  isText: boolean = false
): { result: string; positions: number[] } => {
  let spacedString = '\u00A0'.repeat(leadingSpaces);
  const positions: number[] = [];
  let currentPosition = leadingSpaces;
  
  elements.forEach((element, index) => {
    positions.push(currentPosition);
    
    // Add the element itself
    spacedString += isText ? element : '';
    
    // Add spacing after element if not the last one
    if (index < elements.length - 1) {
      const spacing = pattern[index % pattern.length] || 0;
      spacedString += '\u00A0'.repeat(spacing);
      currentPosition += spacing + 1; // +1 for the element itself
    }
  });

  return { result: spacedString, positions };
};

/**
 * Applies spacing to a group of elements using CSS
 * @param elements Number of elements to space
 * @param pattern Array of spacing values (in pixels or other CSS units)
 * @param unit CSS unit to use (default: 'px')
 * @returns Array of margin values to apply to elements
 */
export const calculateElementSpacing = (
  elements: number,
  pattern: number[],
  unit: string = 'px'
): string[] => {
  return Array.from({ length: elements }).map((_, index) => {
    if (index === elements - 1) return '0';
    const spacing = pattern[index % pattern.length];
    return `${spacing}${unit}`;
  });
};
