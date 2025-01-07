import { MemoryFormProps } from './types';

/**
 * Form component for adding and editing memories
 * Switches between add and edit mode based on editMemoryId
 *
 * @component
 * @example
 * ```tsx
 * <MemoryForm
 *   editMemoryId={null}
 *   editContent=""
 *   newContent=""
 *   activeSection="meta"
 *   onNewContentChange={(content) => setNewContent(content)}
 *   onEditContentChange={(content) => setEditContent(content)}
 *   onCreateMemory={() => handleCreate()}
 *   onUpdateMemory={() => handleUpdate()}
 *   onCancelEdit={() => handleCancel()}
 * />
 */
export const MemoryForm = ({
  editMemoryId,
  editContent,
  newContent,
  activeSection,
  onNewContentChange,
  onEditContentChange,
  onCreateMemory,
  onUpdateMemory,
  onCancelEdit,
}: MemoryFormProps) => {
  if (editMemoryId === null) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={newContent}
          onChange={(e) => onNewContentChange(e.target.value)}
          placeholder={`Add new ${activeSection} memory`}
          className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
        />
        <button
          onClick={onCreateMemory}
          className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
        >
          Add Memory
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={editContent}
        onChange={(e) => onEditContentChange(e.target.value)}
        placeholder="Edit memory"
        className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
      />
      <button
        onClick={onUpdateMemory}
        className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
      >
        Update
      </button>
      <button
        onClick={onCancelEdit}
        className="px-6 py-2 bg-light-secondary dark:bg-dark-secondary text-black/70 dark:text-white/70 rounded-lg hst:rounded-none border border-light-200 dark:border-dark-200"
      >
        Cancel
      </button>
    </div>
  );
};
