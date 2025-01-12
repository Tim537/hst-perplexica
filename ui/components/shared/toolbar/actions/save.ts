import { toast } from 'sonner';

export const saveActions = {
  summary: async (content: string, summaryId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/summaries/${summaryId}/updateSummary`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to save summary');
      }

      await response.json();
      return toast.success('Summary saved successfully');
    } catch (error) {
      console.error('Error saving summary:', error);
    }
    console.log('Saving summary:', content);
  },
  cards: async (content: string) => {
    // TODO: Implement save functionality for cards
    console.log('Saving cards:', content);
  },
};
