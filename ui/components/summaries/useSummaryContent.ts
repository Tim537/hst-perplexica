import { useState, useEffect } from 'react';

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
          // TODO: Implement DB fetch logic
          // const summary = await fetchSummaryFromDB(summaryId);
          // setContent(summary.content);
          setContent("Example stored summary"); // Placeholder
        } else if (mode === 'generate') {
          // TODO: Implement generation logic
          // Will be populated by the generation process
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