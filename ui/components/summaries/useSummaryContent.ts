import { useState, useEffect } from 'react';
import { summaryApi } from '../shared/toolbar/actions/edit';

interface UseSummaryContentProps {
  mode: 'generate' | 'view';
  summaryId?: string;
}

export const useSummaryContent = ({ mode, summaryId }: UseSummaryContentProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        if (mode === 'view' && summaryId) {
          const summary = await summaryApi.load(summaryId);
          setContent(summary.content);
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