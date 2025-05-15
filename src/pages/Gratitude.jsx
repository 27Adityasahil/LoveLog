import React, { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function Gratitude() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadEntries();
    }
  }, [currentUser]);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('gratitude_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading gratitude entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('gratitude_entries')
        .insert([
          {
            text: newEntry,
            user_id: currentUser.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setEntries([data, ...entries]);
      setNewEntry('');
    } catch (error) {
      console.error('Error adding gratitude entry:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <Heart className="w-8 h-8 mr-3 text-pink-500" />
        Gratitude Journal
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="mb-4">
          <label htmlFor="gratitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What are you grateful for today?
          </label>
          <textarea
            id="gratitude"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Entry
        </button>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-gray-900 dark:text-white mb-2">{entry.text}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(entry.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gratitude;