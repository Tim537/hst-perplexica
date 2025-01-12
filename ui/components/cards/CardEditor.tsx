import { cn } from '@/lib/utils';
import { EditorWithExtensions } from '../shared/toolbar/types/editor';
import { createCardsEditorFeatures } from '../shared/toolbar/features/editorBars';
import Toolbar from '../shared/toolbar/Toolbar';
import { EditorContent } from '@tiptap/react';

interface CardEditorProps {
  frontEditor: EditorWithExtensions | null;
  backEditor: EditorWithExtensions | null;
  selectedField: 'front' | 'back';
  onFieldSelect: (field: 'front' | 'back') => void;
}

export default function CardEditor({
  frontEditor,
  backEditor,
  selectedField,
  onFieldSelect,
}: CardEditorProps) {
  const currentEditor = selectedField === 'front' ? frontEditor : backEditor;
  const editorFeatures = createCardsEditorFeatures(currentEditor || undefined);

  const toolBarSpacing = [
    0.8, // undo
    2.5, // redo
    0.8, // bold
    0.8, // italic
    0.8, // underline
    2.5, // color
    0.8, // left
    0.8, // center
    0.8, // right
    2.5, // justify
    0.8, // ordered list
    0.8, // unordered list
  ];

  return (
    <div className="flex flex-col gap-3.5 w-[39.875rem]">
      {/* Editor Toolbar */}
      <Toolbar
        features={editorFeatures}
        content={currentEditor}
        spacing={toolBarSpacing}
        className="h-[3.438rem]"
      />

      {/* Front Input Field */}
      <div
        className={cn(
          'w-full h-[5.2rem]',
          'rounded-[0.7rem] border-[1.5px] dark:border-[#1c1c1c] border-[#CCCCCC] hst:rounded-none overflow-hidden',
          selectedField === 'front' &&
            'dark:border-[#24a0ed90] light:border-[#24a0ed90] hst:border-hst-accent',
        )}
        onClick={() => onFieldSelect('front')}
      >
        <EditorContent
          editor={frontEditor}
          className="p-4 h-full overflow-y-auto scrollbar-none [&_.ProseMirror]:outline-none"
        />
      </div>

      {/* Back Input Field */}
      <div
        className={cn(
          'w-full h-[24rem]',
          'rounded-[1rem] border-[1.5px] dark:border-[#1c1c1c] border-[#CCCCCC] hst:rounded-none overflow-hidden',
          selectedField === 'back' &&
            'dark:border-[#24a0ed90] light:border-[#24a0ed90] hst:border-hst-accent',
        )}
        onClick={() => onFieldSelect('back')}
      >
        <EditorContent
          editor={backEditor}
          className="p-4 h-full overflow-y-auto scrollbar-none [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}
