import { Save, Pencil, ClipboardList, FileUp } from 'lucide-react';
import { saveActions, editActions, copyActions, exportActions } from '../actions';

/**
 * Creates a feature configuration for the summary dialog toolbar
 * @param hasSave - Whether to include the save feature in the toolbar
 *                  Set to true to show the save button, false to hide it
 * @returns A configuration object containing all available features for the summary dialog
 * @example
 * // With save button
 * const features = createSummaryDialogFeatures(true);
 * 
 * // Without save button
 * const features = createSummaryDialogFeatures(false);
 */
export const createSummaryDialogFeatures = (hasSave = false) => ({
  save: hasSave ? {
    icon: Save,
    label: 'Save',
    action: saveActions.summary,
    tooltip: 'Save summary'
  } : null,
  edit: {
    icon: Pencil,
    label: 'Edit',
    action: editActions.summary,
    tooltip: 'Edit summary'
  },
  copy: {
    icon: ClipboardList,
    label: 'Copy',
    action: copyActions.summary,
    tooltip: 'Copy summary'
  },
  export: {
    icon: FileUp,
    label: 'Export',
    action: exportActions.summary,
    tooltip: 'Export summary'
  }
});

/**
 * Creates a feature configuration for the cards dialog toolbar
 * @param hasSave - Whether to include the save feature in the toolbar
 *                  Set to true to show the save button, false to hide it
 * @returns A configuration object containing all available features for the cards dialog
 * @example
 * // With save button
 * const features = createCardsDialogFeatures(true);
 * 
 * // Without save button
 * const features = createCardsDialogFeatures(false);
 */
export const createCardsDialogFeatures = (hasSave = false) => ({
  save: hasSave ? {
    icon: Save,
    label: 'Save',
    action: saveActions.cards,
    tooltip: 'Save cards'
  } : null,
  edit: {
    icon: Pencil,
    label: 'Edit',
    action: editActions.cards,
    tooltip: 'Edit cards'
  },
  export: {
    icon: FileUp,
    label: 'Export',
    action: exportActions.cards,
    tooltip: 'Export cards'
  }
}); 