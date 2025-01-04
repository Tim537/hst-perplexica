import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MemoriesType {
  id: number;
  content: string;
  type: string;
}

const Memories = () => {
  const [memories, setMemories] = useState<MemoriesType[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('text');
  const [editMemoryId, setEditMemoryId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState('text');

  const fetchMemories = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/memories/listMemories`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const memoriesData = await res.json();
    console.log('memoriesData');
    console.log(memoriesData.memories);
    setMemories(memoriesData.memories);
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/memories/addMemory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newContent, type: newType }),
        },
      );

      const newMemory = await res.json();
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

  return (
    <>
      <h1>Memories:</h1>
      <table className="min-w-full divide-y divide-gray-200 bg-transparent">
        <thead className="bg-transparent">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-gray-200">
          {memories.map((memory) => (
            <tr key={memory.id} className="bg-transparent">
              <td className="px-6 py-4 whitespace-nowrap">{memory.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{memory.content}</td>
              <td className="px-6 py-4 whitespace-nowrap">{memory.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="text-red-600 hover:text-red-900 mr-2"
                >
                  <Trash className="w-5 h-5" />
                </button>
                <button
                  onClick={() => startEditMemory(memory)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create Memory</h2>
      <div className="mt-4">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Enter memory content"
          className="border p-2 mr-2"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button
          onClick={createMemory}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Memory
        </button>
      </div>

      {editMemoryId !== null && (
        <>
          <h2>Edit Memory</h2>
          <div className="mt-4">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit memory content"
              className="border p-2 mr-2"
            />
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="border p-2 mr-2"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button
              onClick={updateMemory}
              className="bg-green-500 text-white p-2 rounded"
            >
              Update Memory
            </button>
            <button
              onClick={() => setEditMemoryId(null)}
              className="bg-gray-500 text-white p-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Memories;
