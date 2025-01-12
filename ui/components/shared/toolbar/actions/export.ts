export const exportActions = {
  summary: async (id: number, format: 'pdf' | 'docx') => {
    try {
      const response = await fetch(`/api/summaries/${id}/exportSummary?format=${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export summary');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || `summary_${id}.${format}`;

      // Create blob from response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting summary:', error);
      throw error;
    }
  },
  cards: async (cardIds: number[]) => {
    try {
      const response = await fetch(`/api/cards/exportCards?cardIds=${cardIds.join(',')}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export cards');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'cards.apkg';

      // Create blob from response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting cards:', error);
      throw error;
    }
  }
}; 