import { useState, useEffect } from 'react';

// Sample data - this should be replaced with actual DB data later
const sampleSummaries = [
  {
    id: '1',
    title: 'Introduction to AI',
    content: 'AI is a fascinating field...',
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    content: 'ML is a subset of AI...',
  },
];

/**
 * Props for the useSummaryContent hook
 * @interface UseSummaryContentProps
 */
interface UseSummaryContentProps {
  /** The mode of operation - either generating a new summary or viewing an existing one */
  mode: 'generate' | 'view';
  /** ID of the summary to view (only required in 'view' mode) */
  summaryId?: string;
}

/**
 * Custom hook for managing summary content based on the mode
 * 
 * This hook handles:
 * - Loading existing summaries in view mode
 * - Managing content state for new summaries in generate mode
 * - Loading states and error handling
 * 
 * @param props - The hook's configuration options
 * @returns Object containing the content state and management functions
 * 
 * @example
 * // View mode
 * const { content, isLoading, error } = useSummaryContent({
 *   mode: 'view',
 *   summaryId: '123'
 * });
 * 
 * // Generate mode
 * const { content, setContent } = useSummaryContent({
 *   mode: 'generate'
 * });
 */
export const useSummaryContent = ({ mode, summaryId }: UseSummaryContentProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        if (mode === 'view' && summaryId) {
          const summary = sampleSummaries.find(s => s.id === summaryId);
          if (summary) {
            setContent(summary.content);
          } else {
            setError('Summary not found');
          }
        } else if (mode === 'generate') {
          setContent(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [mode, summaryId]);

  return {
    content,
    setContent,
    isLoading,
    error
  };
}; 