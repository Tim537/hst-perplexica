export type ToolbarMode = 'summary' | 'cards';

export interface ToolbarAction {
  execute: () => void | Promise<void>;
}

export interface ActionsByMode<T> {
  summary: T;
  cards: T;
}

export interface ToolbarActions {
  save?: ActionsByMode<(content: string) => Promise<void>>;
  edit: ActionsByMode<(content: string) => void>;
  copy: ActionsByMode<(content: string) => void>;
  export: ActionsByMode<(content: string) => void>;
} 