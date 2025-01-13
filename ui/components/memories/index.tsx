import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { MemoriesProps, MemorySection, MemoryType } from './types';
import { MemoryItem } from './MemoryItem';
import { MemoryForm } from './MemoryForm';
import { MemoryNavigation, getNavigationItem } from './MemoryNavigation';

/**
 * Main Memories component that provides a dialog for managing different types of memories
 * (meta, image, video). It includes functionality for creating, editing, and deleting memories.
 *
 * @component
 * @example
 * ```tsx
 * <Memories isOpen={isOpen} setIsOpen={setIsOpen} />
 * ```
 */
const Memories: React.FC<MemoriesProps> = ({ isOpen = false, setIsOpen }) => {
  // State management
  const [memories, setMemories] = useState<MemoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [editMemoryId, setEditMemoryId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeSection, setActiveSection] = useState<MemorySection>('meta');

  /**
   * Fetches all memories from the API
   */
  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/memories/listMemories`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!res.ok) {
        throw new Error('Failed to fetch memories');
      }
      const memoriesData = await res.json();
      setMemories(memoriesData.memories || []);
    } catch (err) {
      console.error('Error fetching memories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch memories');
    } finally {
      setLoading(false);
    }
  };

  // Load memories on component mount
  useEffect(() => {
    fetchMemories();
  }, []);

  /**
   * Deletes a memory by its ID
   * @param id - The ID of the memory to delete
   */
  const deleteMemory = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/memories/${id}/deleteMemory/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      fetchMemories();
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  /**
   * Creates a new memory
   */
  const createMemory = async () => {
    if (!newContent) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/addMemory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          type: activeSection === 'meta' ? 'text' : activeSection,
        }),
      });
      fetchMemories();
      setNewContent('');
    } catch (err) {
      console.error('Failed to create memory:', err);
    }
  };

  /**
   * Initiates editing of a memory
   * @param memory - The memory to edit
   */
  const startEditMemory = (memory: MemoryType) => {
    setEditMemoryId(memory.id);
    setEditContent(memory.content);
  };

  /**
   * Updates an existing memory
   */
  const updateMemory = async () => {
    if (editMemoryId === null || !editContent) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/editMemory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          type: activeSection === 'meta' ? 'text' : activeSection,
          id: editMemoryId,
        }),
      });
      fetchMemories();
      setEditMemoryId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  };

  /**
   * Renders the main content of the dialog
   */
  const renderContent = () => {
    if (!memories || loading) return null;

    // Filter memories based on active section
    const currentMemories = memories.filter((memory) => {
      switch (activeSection) {
        case 'meta':
          return memory.type === 'text';
        case 'image':
          return memory.type === 'image';
        case 'video':
          return memory.type === 'video';
        default:
          return false;
      }
    });

    const currentNavItem = getNavigationItem(activeSection);

    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <p className="text-black/70 dark:text-white/70 text-sm">
            {currentNavItem?.description}
          </p>

          {/* Memory list */}
          <div className="w-full h-[25rem] overflow-scroll border border-light-200 dark:border-dark-200 rounded-lg hst:rounded-none p-4 overflow-y-auto">
            {currentMemories.map((memory) => (
              <MemoryItem
                key={memory.id}
                memory={memory}
                onEdit={startEditMemory}
                onDelete={deleteMemory}
              />
            ))}
          </div>

          {/* Memory form */}
          <MemoryForm
            editMemoryId={editMemoryId}
            editContent={editContent}
            newContent={newContent}
            activeSection={activeSection}
            onNewContentChange={setNewContent}
            onEditContentChange={setEditContent}
            onCreateMemory={createMemory}
            onUpdateMemory={updateMemory}
            onCancelEdit={() => setEditMemoryId(null)}
          />
        </div>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen?.(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform rounded-2xl hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
                {/* Dialog header */}
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle className="text-xl font-medium text-black dark:text-white">
                    Memories
                  </DialogTitle>
                  <button
                    onClick={() => setIsOpen?.(false)}
                    className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                    title="Close dialog"
                    aria-label="Close dialog"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Dialog content */}
                <div className="flex gap-8">
                  <MemoryNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="w-full flex items-center justify-center py-6 text-black/70 dark:text-white/70">
                        Loading memories...
                      </div>
                    ) : (
                      renderContent()
                    )}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Memories;
