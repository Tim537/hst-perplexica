import { useEffect, useRef } from 'react';
import { createElementSpacing } from '@/lib/utils';

const AnimatedLogo = () => {
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const leftTextTopRef = useRef<HTMLDivElement>(null);
  const leftTextBottomRef = useRef<HTMLDivElement>(null);
  const rightTextRefs = {
    hoch: useRef<HTMLDivElement>(null),
    schule: useRef<HTMLDivElement>(null),
    trier: useRef<HTMLDivElement>(null),
  };

  // Use the new utility function for text spacing
  const createSpacedText = (
    text: string,
    pattern: number[],
    leadingSpaces: number = 0,
  ): string => {
    const chars = text.split('');
    const { result } = createElementSpacing(
      chars,
      pattern,
      leadingSpaces,
      true,
    );
    return result;
  };

  useEffect(() => {
    const verticalLine = verticalLineRef.current;
    const leftTextTop = leftTextTopRef.current;
    const leftTextBottom = leftTextBottomRef.current;
    const rightTexts = {
      hoch: rightTextRefs.hoch.current,
      schule: rightTextRefs.schule.current,
      trier: rightTextRefs.trier.current,
    };

    if (
      !verticalLine ||
      !leftTextTop ||
      !leftTextBottom ||
      !rightTexts.hoch ||
      !rightTexts.schule ||
      !rightTexts.trier
    )
      return;

    // Reset initial positions
    verticalLine.style.opacity = '0';
    verticalLine.style.transform = 'scaleY(0)';
    verticalLine.style.transformOrigin = 'bottom';

    [leftTextTop, leftTextBottom].forEach((element) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(0)';
      }
    });

    Object.values(rightTexts).forEach((element) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(0)';
      }
    });

    // Split text into spans for individual character animation
    const splitText = (element: HTMLDivElement) => {
      const text = element.textContent || '';
      element.textContent = '';
      return Array.from(text).map((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        element.appendChild(span);
        return span;
      });
    };

    // Split only the German text
    const hochChars = splitText(rightTexts.hoch);
    const schuleChars = splitText(rightTexts.schule);
    const trierChars = splitText(rightTexts.trier);
    const allGermanChars = [...hochChars, ...schuleChars, ...trierChars];

    // Step 1: Animate vertical line from bottom
    setTimeout(() => {
      verticalLine.style.transition = 'all 0.8s ease-out';
      verticalLine.style.opacity = '1';
      verticalLine.style.transform = 'scaleY(1)';
    }, 500);

    // Step 2: Fade in and translate text from middle
    setTimeout(() => {
      // Animate English text
      [leftTextTop, leftTextBottom].forEach((element) => {
        if (element) {
          element.style.transition = 'all 0.8s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateX(-20px)';
        }
      });

      // Animate German text containers
      Object.values(rightTexts).forEach((element) => {
        if (element) {
          element.style.transition = 'all 0.8s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateX(20px)';
        }
      });
    }, 1300);

    // Step 3: Split characters with random movement (only German text)
    setTimeout(() => {
      allGermanChars.forEach((char, index) => {
        setTimeout(() => {
          char.style.transition = 'all 0.6s ease-in-out';
          char.style.opacity = '1';

          // Random movement direction and distance
          const direction = Math.random() > 0.5 ? 1 : -1;
          const distance = Math.random() * 15 + 10;
          char.style.transform = `translateX(${direction * distance}px)`;

          // Return to original position
          setTimeout(() => {
            char.style.transform = 'translateX(0)';
          }, 600);
        }, index * 50);
      });
    }, 2500);
  }, []);

  return (
    <div className="relative w-full px-5 py-4 flex justify-center">
      {/* Left side - English text */}
      <div className="flex flex-col items-end text-right pr-0 text-black/80 dark:text-white/80 self-end">
        <div ref={leftTextTopRef} className="text-[0.8rem] tracking-wide">
          Trier University
        </div>
        <div ref={leftTextBottomRef} className="text-[0.8rem] tracking-wide">
          of Applied Sciences
        </div>
      </div>

      {/* Vertical line */}
      <div
        ref={verticalLineRef}
        className="h-[95px] w-[1px] bg-black dark:bg-white mx-4"
      />

      {/* Right side - German text */}
      <div className="flex flex-col items-start pl-0 text-black dark:text-white">
        <div ref={rightTextRefs.hoch} className="text-2xl font-bold">
          {createSpacedText('HOCH', [9, 1, 4], 0)}
        </div>
        <div ref={rightTextRefs.schule} className="text-2xl font-bold">
          {createSpacedText('SCHULE', [3, 7, 4, 1], 4)}
        </div>
        <div ref={rightTextRefs.trier} className="text-2xl font-bold">
          {createSpacedText('TRIER', [4, 4, 1, 5], 0)}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
