import { Trash, Pencil, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';

interface MemoriesType {
  id: number;
  content: string;
  type: string;
}

interface MemoriesProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const Memories: React.FC<MemoriesProps> = ({ isOpen = false, setIsOpen }) => {
  const [memories, setMemories] = useState<MemoriesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('text');
  const [editMemoryId, setEditMemoryId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('text');

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
        body: JSON.stringify({ content: newContent, type: newType }),
      });

      fetchMemories();
      setNewContent('');
      setNewType('text');
    } catch (err) {
      console.error('Failed to create memory:', err);
    }
  };

  const startEditMemory = (memory: MemoriesType) => {
    setEditMemoryId(memory.id);
    setEditContent(memory.content);
    setEditType(memory.type);
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
          type: editType,
          id: editMemoryId,
        }),
      });

      fetchMemories();
      setEditMemoryId(null);
      setEditContent('');
      setEditType('text');
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

  if (loading) {
    return <div>Loading memories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const imageMemories = memories.filter((memory) => memory.type === 'image');
  const videoMemories = memories.filter((memory) => memory.type === 'video');
  const metaMemories = memories.filter((memory) => memory.type === 'text');

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
              <DialogPanel className="w-full lg:w-[1101px] transform bg-light-secondary dark:bg-dark-secondary p-6 rounded-2xl hst:rounded-none border border-light-200 dark:border-dark-200 text-left align-middle transition-all">
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

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Meta Search Memories */}
                  <div className="w-full">
                    <div className="text-black/70 dark:text-white/70 text-sm font-medium">
                      Meta Search
                    </div>
                    <p className="text-black/70 dark:text-white/70 text-xs font-light mb-4">
                      Memories which affects the Meta Search, e.g.{' '}
                      <span className="italic">
                        Answer always in simple english
                      </span>
                    </p>
                    <div className="w-full h-[15rem] lg:h-[25rem] overflow-scroll border border-light-200 dark:border-dark-200 rounded-lg hst:rounded-none p-4 overflow-y-auto">
                      {metaMemories.map((memory) => (
                        <MemoryItem key={memory.id} memory={memory} />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full lg:w-auto">
                    {/* Image Search Memories */}
                    <div>
                      <div className="text-black/70 dark:text-white/70 text-sm font-medium">
                        Image Search
                      </div>
                      <p className="text-black/70 dark:text-white/70 text-xs font-light mb-4">
                        Memories which affects the Image Search, e.g.{' '}
                        <span className="italic">
                          search just black white Images
                        </span>
                      </p>
                      <div className="w-full lg:w-[30rem] h-[10rem] overflow-scroll border border-light-200 dark:border-dark-200 rounded-lg hst:rounded-none p-4 overflow-y-auto">
                        {imageMemories.map((memory) => (
                          <MemoryItem key={memory.id} memory={memory} />
                        ))}
                      </div>
                    </div>

                    {/* Video Search Memories */}
                    <div>
                      <div className="text-black/70 dark:text-white/70 text-sm font-medium">
                        Video Search
                      </div>
                      <p className="text-black/70 dark:text-white/70 text-xs lg:text-[0.72rem] font-light mb-4">
                        Memories which affects the Video Search, e.g.{' '}
                        <span className="italic">
                          search just english-speaking videos
                        </span>
                      </p>
                      <div className="w-full lg:w-[30rem] h-[10rem] overflow-scroll border border-light-200 dark:border-dark-200 rounded-lg hst:rounded-none p-4 overflow-y-auto">
                        {videoMemories.map((memory) => (
                          <MemoryItem key={memory.id} memory={memory} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add/Edit Memory Form */}
                <div className="mt-6">
                  {editMemoryId === null ? (
                    <div className="flex flex-col lg:flex-row gap-2">
                      <input
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Enter the new memory"
                        className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                      />
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                        title="Select memory type"
                        aria-label="Select memory type"
                      >
                        <option value="text">Meta Memory</option>
                        <option value="image">Image Memory</option>
                        <option value="video">Video Memory</option>
                      </select>
                      <button
                        onClick={createMemory}
                        className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
                      >
                        Add Memory
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-4">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit memory content"
                        className="flex-1 px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                      />
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="px-4 py-2 rounded-lg hst:rounded-none bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 dark:text-white text-sm"
                        title="Select memory type"
                        aria-label="Select memory type"
                      >
                        <option value="text">Meta Memory</option>
                        <option value="image">Image Memory</option>
                        <option value="video">Video Memory</option>
                      </select>
                      <button
                        onClick={updateMemory}
                        className="px-6 py-2 bg-[#24A0ED] hst:bg-hst-accent text-white rounded-lg hst:rounded-none hst:hover:scale-110 hover:bg-opacity-85 transition duration-100"
                      >
                        Update Memory
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
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Memories;
