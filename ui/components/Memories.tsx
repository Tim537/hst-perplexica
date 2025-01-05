import { Trash, Pencil, X, FileText, Image, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface MemoriesType {
  id: number;
  content: string;
  type: string;
}

interface MemoriesProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

type MemorySection = 'meta' | 'image' | 'video';

const Memories: React.FC<MemoriesProps> = ({ isOpen = false, setIsOpen }) => {
  const [memories, setMemories] = useState<MemoriesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [editMemoryId, setEditMemoryId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeSection, setActiveSection] = useState<MemorySection>('meta');

  const navigationItems = [
    {
      id: 'meta' as MemorySection,
      label: 'Meta Memories',
      icon: <FileText className="w-5 h-5" />,
      description:
        'Memories which affects the Meta Search, e.g. Answer always in simple english',
    },
    {
      id: 'image' as MemorySection,
      label: 'Image Memories',
      icon: <Image className="w-5 h-5" />,
      description:
        'Memories which affects the Image Search, e.g. search just black white Images',
    },
    {
      id: 'video' as MemorySection,
      label: 'Video Memories',
      icon: <Video className="w-5 h-5" />,
      description:
        'Memories which affects the Video Search, e.g. search just english-speaking videos',
    },
  ];

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

  useEffect(() => {
    fetchMemories();
  }, []);

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

  const startEditMemory = (memory: MemoriesType) => {
    setEditMemoryId(memory.id);
    setEditContent(memory.content);
  };

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

  const MemoryItem = ({ memory }: { memory: MemoriesType }) => (
    <div className="w-full border-b border-light-200 dark:border-dark-200 py-2 flex justify-between items-center">
      <span className="text-black/90 dark:text-white/90 text-sm font-light">
        {memory.content}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => startEditMemory(memory)}
          className="p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded-lg hst:rounded-none transition-colors"
          title="Edit memory"
          aria-label="Edit memory"
        >
          <Pencil className="w-5 h-5 stroke-[#24A0ED] hst:stroke-hst-accent" />
        </button>
        <button
          onClick={() => deleteMemory(memory.id)}
          className="p-1 hover:bg-light-200 dark:hover:bg-dark-200 rounded-lg hst:rounded-none transition-colors"
          title="Delete memory"
          aria-label="Delete memory"
        >
          <Trash className="w-5 h-5 stroke-[#FF8383]" />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!memories || loading) return null;

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

    const currentNavItem = navigationItems.find(
      (item) => item.id === activeSection,
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <p className="text-black/70 dark:text-white/70 text-sm">
            {currentNavItem?.description}
          </p>

          {/* Memory List */}
          <div className="w-full h-[25rem] overflow-scroll border border-light-200 dark:border-dark-200 rounded-lg hst:rounded-none p-4 overflow-y-auto">
            {currentMemories.map((memory) => (
              <MemoryItem key={memory.id} memory={memory} />
            ))}
          </div>

          {/* Add/Edit Memory Form */}
          <div className="flex flex-col space-y-2">
            {editMemoryId === null ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={`Add new ${activeSection} memory`}
                  className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                />
                <button
                  onClick={createMemory}
                  className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
                >
                  Add Memory
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit memory"
                  className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                />
                <button
                  onClick={updateMemory}
                  className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditMemoryId(null)}
                  className="px-6 py-2 bg-light-secondary dark:bg-dark-secondary text-black/70 dark:text-white/70 rounded-lg hst:rounded-none border border-light-200 dark:border-dark-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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

                <div className="flex gap-8">
                  {/* Navigation */}
                  <div className="w-48 shrink-0">
                    <nav className="flex flex-col space-y-1">
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            'flex items-center space-x-3 px-3 py-2 rounded-lg hst:rounded-none text-sm font-medium transition-colors',
                            activeSection === item.id
                              ? 'bg-[#24A0ED] hst:bg-hst-accent text-white'
                              : 'text-black/70 dark:text-white/70 hover:bg-light-200 dark:hover:bg-dark-200',
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Content */}
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
