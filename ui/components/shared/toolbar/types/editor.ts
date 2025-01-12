import { Editor } from '@tiptap/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface EditorFeature {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  action: (editor?: EditorWithExtensions) => void;
  component?: () => ReactNode;
  className?: string;
}

export interface EditorFeatures {
  [key: string]: EditorFeature;
}

export type EditorWithExtensions = Editor & {
  chain: () => {
    focus: () => {
      toggleBold: () => { run: () => void };
      toggleItalic: () => { run: () => void };
      toggleUnderline: () => { run: () => void };
      setColor: (color: string) => { run: () => void };
      unsetColor: () => { run: () => void };
      toggleHeading: (options: { level: number }) => { run: () => void };
      setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => { run: () => void };
      toggleBulletList: () => { run: () => void };
      toggleOrderedList: () => { run: () => void };
      setHorizontalRule: () => { run: () => void };
      undo: () => { run: () => void };
      redo: () => { run: () => void };
      setParagraph: () => { run: () => void };
    };
  };
  getAttributes: (type: string) => Record<string, any>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}; 