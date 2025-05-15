import React, { useState } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { Book, Plus } from 'lucide-react';

function Journal() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { entries, addEntry } = useJournal();

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <Book className="w-8 h-8 mr-3" />
        Journal Entries
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Entry
        </button>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{entry.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{entry.content}</p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal;