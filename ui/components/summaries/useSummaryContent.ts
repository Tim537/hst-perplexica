import { useState, useEffect } from 'react';
import { summaryApi } from '../shared/toolbar/actions/edit';

interface UseSummaryContentProps {
  mode: 'generate' | 'view';
  chatId: string;
}

export const useSummaryContent = ({ mode, chatId }: UseSummaryContentProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{ id: number } | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (mode === 'view' && chatId) {
          const summary = await summaryApi.load(chatId);
          setContent(summary.content);
          setSummaryData({ id: parseInt(summary.id) });
        } else if (mode === 'generate') {
          setContent(null);
          setSummaryData(null);
        }
      } catch (err) {
        console.log('new summary error');
        console.log(err);
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      }
    };

    loadContent();
  }, [mode, chatId]);

  return {
    content,
    setContent,
    error,
    summaryData,
  };
};
