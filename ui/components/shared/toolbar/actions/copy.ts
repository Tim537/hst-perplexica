export const copyActions = {
  summary: (content: string) => {
    navigator.clipboard.writeText(content);
  },
}; 