import { Pencil, Copy, Download } from 'lucide-react';

import { editActions, copyActions, exportActions } from '../actions';

/**
 * Creates a feature configuration for the summary dialog toolbar
 * @returns A configuration object containing all available features for the summary dialog
 */
export const createSummaryDialogFeatures = (summaryId: number) => ({
  edit: {
    icon: Pencil,
    label: 'Edit',
    action: () => editActions.summary(summaryId),
    tooltip: 'Edit summary',
  },
  copy: {
    icon: Copy,
    label: 'Copy',
    action: copyActions.summary,
    tooltip: 'Copy to clipboard',
  },
  export: {
    icon: Download,
    label: 'Export',
    action: (content: any) => exportActions.summary(content, 'pdf'),
    tooltip: 'Export summary',
  },
});

/**
 * Creates a feature configuration for the cards dialog toolbar
 * @returns A configuration object containing all available features for the cards dialog
 */
export const createCardsDialogFeatures = (stackId: number) => ({
  edit: {
    icon: Pencil,
    label: 'Edit',
    action: () => editActions.cards(stackId),
    tooltip: 'Edit cards',
  },
  export: {
    icon: Download,
    label: 'Export',
    action: exportActions.cards,
    tooltip: 'Export cards',
  },
});
