'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Toolbar from '@/components/shared/toolbar/Toolbar';
import { createSummaryEditorFeatures } from '@/components/shared/toolbar/features/editorBars';
import { Select } from '@/components/shared/forms/Select';
import { EditorFeatures } from '@/components/shared/toolbar/types/editor';

const TextEditor = () => {
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
    content: '<p>Beginnen Sie hier mit dem Schreiben...</p>',
  });

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

  const baseFeatures = createSummaryEditorFeatures('/test');
  const features: EditorFeatures = {
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="fixed top-0 w-[49.5rem] bg-background pt-[4rem] z-50">
        <Toolbar features={features} content={editor} />
      </div>

      <div className=" relative top-[10rem] w-[21cm] min-h-[29.7cm] bg-white dark:bg-light-primary shadow-md p-8">
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
