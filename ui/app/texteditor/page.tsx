'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useSearchParams } from 'next/navigation';
import Toolbar from '@/components/shared/toolbar/Toolbar';
import { createSummaryEditorFeatures } from '@/components/shared/toolbar/features/editorBars';
import { Select } from '@/components/shared/forms/Select';
import {
  EditorFeatures,
  EditorWithExtensions,
} from '@/components/shared/toolbar/types/editor';
import { LucideIcon } from 'lucide-react';

type ToolbarFeatures = Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    action: (content: any) => void;
    tooltip: string;
    component?: () => React.ReactNode;
  } | null
>;

const EDITOR_TOOLBAR_SPACING = [
  0.8, // back
  0.8, // save
  2, // export

  0.8, // undo
  1.5, // redo

  1.2, // type

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
  0.8, // horizontal line
];

const TextEditor = () => {
  const searchParams = useSearchParams();
  const initialContent = searchParams.get('content') || '';

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Underline,
    ],
    content: decodeURIComponent(initialContent),
  }) as EditorWithExtensions | null;

  const handleTypeChange = (value: string) => {
    if (!editor) return;

    switch (value) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
    }
  };

  const baseFeatures = createSummaryEditorFeatures(
    '/learnit',
    editor || undefined,
  );
  const features = {
    ...baseFeatures,
    type: {
      ...baseFeatures.type,
      component: () => (
        <div className="px-2">
          <Select
            defaultValue="paragraph"
            onChange={handleTypeChange}
            options={[
              { value: 'paragraph', label: 'Text' },
              { value: 'h1', label: 'H1' },
              { value: 'h2', label: 'H2' },
              { value: 'h3', label: 'H3' },
            ]}
            className="w-[90px]"
          />
        </div>
      ),
    },
  } as unknown as ToolbarFeatures;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="fixed top-0 w-[49.5rem] bg-background pt-[4rem] z-50">
        <Toolbar
          features={features}
          content={editor}
          spacing={EDITOR_TOOLBAR_SPACING}
        />
      </div>

      <div className=" relative top-[10rem] w-[21cm] min-h-[29.7cm] mb-[10rem] bg-white dark:bg-light-primary shadow-md p-8">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&:focus]:outline-none [&_*:focus]:outline-none"
        />
      </div>
    </div>
  );
};

export default function TextEditorPage() {
  return <TextEditor />;
}
