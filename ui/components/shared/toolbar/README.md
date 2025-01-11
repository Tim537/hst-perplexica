# Universal Toolbar Component

A flexible and reusable toolbar component that can be configured for different use cases like summaries, rich text editing, flashcards, etc.

## Directory Structure

```
📁 toolbar/
├── 📁 actions/         # API calls and functionality
├── 📁 features/        # Feature definitions and configurations
│   ├── dialogBars.ts   # Features for dialog windows (summary, cards)
│   └── editorBars.ts   # Features for rich text editors (Tiptap-based)
├── 📁 types/          # TypeScript type definitions
├── Toolbar.tsx        # Main component
└── index.ts          # Public API exports
```

## Usage

### Dialog Features

```typescript
import { createSummaryDialogFeatures } from '@/components/shared/toolbar/features/dialogBars';

// With save button
const features = createSummaryDialogFeatures(true);

// Without save button (default)
const features = createSummaryDialogFeatures();

<Toolbar 
  features={features}
  content={content}
/>
```

### Editor Features

```typescript
import { createSummaryEditorFeatures } from '@/components/shared/toolbar/features/editorBars';

// Rich text editor with Tiptap features
const features = createSummaryEditorFeatures();

<Toolbar 
  features={features}
  content={editorContent}
/>
```

## Available Features

### Dialog Features (`dialogBars.ts`)
- `createSummaryDialogFeatures(hasSave?: boolean)`
  - Parameters:
    - `hasSave`: Optional boolean to show/hide save button
  - Returns: Configuration with save, edit, copy, and export features
  - Example: `createSummaryDialogFeatures(true)`

- `createCardsDialogFeatures()`
  - Returns: Configuration for cards dialog features
  - Example: `createCardsDialogFeatures()`

### Editor Features (`editorBars.ts`)
- `createSummaryEditorFeatures()`
  - Returns: Tiptap-based rich text editor features (bold, italic, link, etc.)
  - Example: `createSummaryEditorFeatures()`

- `createCardsEditorFeatures()`
  - Returns: Configuration for cards editor features
  - Example: `createCardsEditorFeatures()`

## Adding New Features

1. Choose the appropriate feature file based on functionality:
   - Dialog-related features go in `dialogBars.ts`
   - Editor-related features go in `editorBars.ts`

2. Add your feature configuration:
```typescript
// in dialogBars.ts or editorBars.ts
export const createYourFeatures = (options) => ({
  featureName: {
    icon: YourIcon,
    label: 'Feature Label',
    action: yourAction,
    tooltip: 'Feature Tooltip'
  }
});
```

3. Add corresponding actions in `actions/` folder if needed:
```typescript
// actions/yourAction.ts
export const yourActions = {
  summary: (content) => {
    // Implementation
  },
  cards: (content) => {
    // Implementation
  }
};
```

## Feature Configuration

Each feature should follow this structure:
```typescript
{
  icon: LucideIcon,     // Icon component from lucide-react
  label: string,        // Label for the tooltip
  action: Function,     // Action to execute when clicked
  tooltip: string       // Tooltip text
}
```

## Best Practices

1. **Feature Organization**
   - Keep dialog features in `dialogBars.ts`
   - Keep editor features in `editorBars.ts`
   - Group related features in the same file

2. **Action Implementation**
   - Keep actions separate in `actions/` folder
   - Actions should be mode-aware (summary/cards)
   - Handle errors gracefully

3. **Styling**
   - Use existing theme variables
   - Follow HST theme guidelines
   - Maintain consistent spacing

## Contributing

When adding new features:
1. Choose the appropriate feature file
2. Add TypeScript types if needed
3. Update this documentation
4. Test in all relevant modes
5. Ensure HST theme compatibility 