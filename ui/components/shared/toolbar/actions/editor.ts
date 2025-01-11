import { EditorWithExtensions } from '../types/editor';
import { useRouter } from 'next/navigation';

export const editorActions = {
  // Navigation
  back: (url: string) => {
    window.location.href = url;
  },

  // Text Style
  toggleBold: (editor: EditorWithExtensions) => {
    editor.chain().focus().toggleBold().run();
  },
  toggleItalic: (editor: EditorWithExtensions) => {
    editor.chain().focus().toggleItalic().run();
  },
  toggleUnderline: (editor: EditorWithExtensions) => {
    editor.chain().focus().toggleUnderline().run();
  },
  setTextColor: (editor: EditorWithExtensions | undefined, color?: string) => {
    if (!editor) return;
    if (color) {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().unsetColor().run();
    }
  },
  getTextColor: (editor: EditorWithExtensions | undefined) => {
    if (!editor) return '';
    return editor.getAttributes('textStyle').color || '';
  },

  // Headings
  setHeading: (editor?: EditorWithExtensions) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  },

  // Alignment
  alignLeft: (editor: EditorWithExtensions) => {
    editor.chain().focus().setTextAlign('left').run();
  },
  alignCenter: (editor: EditorWithExtensions) => {
    editor.chain().focus().setTextAlign('center').run();
  },
  alignRight: (editor: EditorWithExtensions) => {
    editor.chain().focus().setTextAlign('right').run();
  },
  alignJustify: (editor: EditorWithExtensions) => {
    editor.chain().focus().setTextAlign('justify').run();
  },

  // Lists
  toggleBulletList: (editor: EditorWithExtensions) => {
    editor.chain().focus().toggleBulletList().run();
  },
  toggleOrderedList: (editor: EditorWithExtensions) => {
    editor.chain().focus().toggleOrderedList().run();
  },

  // Structure
  insertHorizontalRule: (editor: EditorWithExtensions) => {
    editor.chain().focus().setHorizontalRule().run();
  },

  // History
  undo: (editor: EditorWithExtensions) => {
    editor.chain().focus().undo().run();
  },
  redo: (editor: EditorWithExtensions) => {
    editor.chain().focus().redo().run();
  },
}; 