export const editActions = {
  summary: (content: string) => {
    window.location.href = `/texteditor?content=${encodeURIComponent(content)}`;
  },
  cards: (content: string) => {
    window.location.href = `/cardseditor?content=${encodeURIComponent(content)}`;
  }
}; 