/** 
 * Represents a single memory entry in the system
 */
export type MemoryType = {
  id: number;
  content: string;
   type: string;
};

/** 
 * Available sections in the memories dialog
 * - meta: For meta search memories (text-based)
 * - image: For image search memories
 * - video: For video search memories
 */
export type MemorySection = 'meta' | 'image' | 'video';

/**
 * Props for the main Memories dialog component
 */
export interface MemoriesProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

/**
 * Props for the individual memory item component
 */
export interface MemoryItemProps {
    memory: MemoryType;
    onEdit: (memory: MemoryType) => void;
    onDelete: (id: number) => void;
}

/**
 * Props for the memory form component used for adding/editing memories
 */
export interface MemoryFormProps {
   editMemoryId: number | null;
    editContent: string;
    newContent: string;
    activeSection: MemorySection;
    onNewContentChange: (content: string) => void;
    onEditContentChange: (content: string) => void;
    onCreateMemory: () => void;
    onUpdateMemory: () => void;
    onCancelEdit: () => void;
}

/**
 * Props for the memory navigation component
 */
export interface MemoryNavigationProps {
  activeSection: MemorySection;
  onSectionChange: (section: MemorySection) => void;
} 