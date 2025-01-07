import { Trash, Pencil } from 'lucide-react';
import { MemoryItemProps } from './types';

/**
 * Renders a single memory item with edit and delete actions
 *
 * @component
 * @example
 * ```tsx
 * <MemoryItem
 *   memory={{ id: 1, content: "Example memory", type: "text" }}
 *   onEdit={(memory) => handleEdit(memory)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
export const MemoryItem = ({ memory, onEdit, onDelete }: MemoryItemProps) => (
  <div className="w-full border-b border-light-200 dark:border-dark-200 py-2 flex justify-between items-center">
    <span className="text-black/90 dark:text-white/90 text-sm font-light">
      {memory.content}
    </span>
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(memory)}
        className="p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded-lg hst:rounded-none transition-colors"
        title="Edit memory"
        aria-label="Edit memory"
      >
        <Pencil className="w-5 h-5 stroke-[#24A0ED] hst:stroke-hst-accent" />
      </button>
      <button
        onClick={() => onDelete(memory.id)}
        className="p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded-lg hst:rounded-none transition-colors"
        title="Delete memory"
        aria-label="Delete memory"
      >
        <Trash className="w-5 h-5 stroke-[#FF8383]" />
      </button>
    </div>
  </div>
);
