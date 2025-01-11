import { Editor } from '@tiptap/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface EditorFeature {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  action: (editor?: EditorWithExtensions) => void;
  component?: () => ReactNode;
}

export interface EditorFeatures {
  back: EditorFeature;
  save: EditorFeature;
  export: EditorFeature;
  undo: EditorFeature;
  redo: EditorFeature;
  type: EditorFeature;
  bold: EditorFeature;
  italic: EditorFeature;
  underline: EditorFeature;
  textColor: EditorFeature;
  alignLeft: EditorFeature;
  alignCenter: EditorFeature;
  alignRight: EditorFeature;
  alignJustify: EditorFeature;
  bulletList: EditorFeature;
  orderedList: EditorFeature;
  horizontalRule: EditorFeature;
}

export type EditorWithExtensions = Editor & {
  chain: () => {
    focus: () => {
      toggleBold: () => { run: () => void };
      toggleItalic: () => { run: () => void };
      toggleUnderline: () => { run: () => void };
      setColor: (color: string) => { run: () => void };
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
}; 