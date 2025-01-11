import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Undo,
  Redo,
  PaintBucket,
  ArrowLeft,
  Save,
  FileUp,
  Type,
} from 'lucide-react';

import { editorActions } from '../actions/editor';
import { Select } from '@/components/shared/forms/Select';
import { EditorFeatures } from '../types/editor';

export const createSummaryEditorFeatures = (
  backUrl: string = '/',
): EditorFeatures => ({
  back: {
    icon: ArrowLeft,
    label: 'Back',
    tooltip: 'Go back',
    action: () => editorActions.back(backUrl),
  },
  save: {
    icon: Save,
    label: 'Save',
    tooltip: 'Save changes',
    action: () => {
      console.log('Save clicked');
    },
  },
  export: {
    icon: FileUp,
    label: 'Export',
    tooltip: 'Export as file',
    action: () => {
      console.log('Export clicked');
    },
  },
  undo: {
    icon: Undo,
    label: 'Undo',
    tooltip: 'Undo last change',
    action: editorActions.undo,
  },
  redo: {
    icon: Redo,
    label: 'Redo',
    tooltip: 'Redo last change',
    action: editorActions.redo,
  },
  type: {
    icon: Type,
    label: 'Type',
    tooltip: 'Select text type',
    action: editorActions.setHeading,
    component: () => null,
  },
  bold: {
    icon: Bold,
    label: 'Bold',
    tooltip: 'Make text bold',
    action: editorActions.toggleBold,
  },
  italic: {
    icon: Italic,
    label: 'Italic',
    tooltip: 'Make text italic',
    action: editorActions.toggleItalic,
  },
  underline: {
    icon: Underline,
    label: 'Underline',
    tooltip: 'Underline text',
    action: editorActions.toggleUnderline,
  },
  textColor: {
    icon: PaintBucket,
    label: 'Color',
    tooltip: 'Change text color',
    action: editorActions.setTextColor,
  },
  alignLeft: {
    icon: AlignLeft,
    label: 'Left',
    tooltip: 'Align text left',
    action: editorActions.alignLeft,
  },
  alignCenter: {
    icon: AlignCenter,
    label: 'Center',
    tooltip: 'Center text',
    action: editorActions.alignCenter,
  },
  alignRight: {
    icon: AlignRight,
    label: 'Right',
    tooltip: 'Align text right',
    action: editorActions.alignRight,
  },
  alignJustify: {
    icon: AlignJustify,
    label: 'Justify',
    tooltip: 'Justify text',
    action: editorActions.alignJustify,
  },
  bulletList: {
    icon: List,
    label: 'Bullet List',
    tooltip: 'Create bullet list',
    action: editorActions.toggleBulletList,
  },
  orderedList: {
    icon: ListOrdered,
    label: 'Numbered List',
    tooltip: 'Create numbered list',
    action: editorActions.toggleOrderedList,
  },
  horizontalRule: {
    icon: Minus,
    label: 'Line',
    tooltip: 'Insert horizontal line',
    action: editorActions.insertHorizontalRule,
  },
});
