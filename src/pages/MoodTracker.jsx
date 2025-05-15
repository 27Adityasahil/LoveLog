import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Meh, Frown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function MoodTracker() {
  const [moodData, setMoodData] = useState([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [note, setNote] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadMoods();
    }
  }, [currentUser]);

  const loadMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMoodData(data || []);
    } catch (error) {
      console.error('Error loading moods:', error);
    }
  };

  const addMoodEntry = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .insert([
          {
            rating: currentMood,
            note,
            user_id: currentUser.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setMoodData([...moodData, data]);
      setNote('');
    } catch (error) {
      console.error('Error adding mood:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mood Tracker</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <div className="flex justify-center space-x-8 mb-6">
          <button
            onClick={() => setCurrentMood(3)}
            className={`p-4 rounded-full ${currentMood === 3 ? 'bg-red-100 dark:bg-red-900/30' : ''}`}
          >
            <Frown className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => setCurrentMood(5)}
            className={`p-4 rounded-full ${currentMood === 5 ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}
          >
            <Meh className="w-8 h-8 text-yellow-500" />
          </button>
          <button
            onClick={() => setCurrentMood(7)}
            className={`p-4 rounded-full ${currentMood === 7 ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
          >
            <Smile className="w-8 h-8 text-green-500" />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about your mood..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4"
          rows="3"
        />

        <button
          onClick={addMoodEntry}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Mood
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Mood History</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleString()}
                formatter={(value) => [`Mood: ${value}`]}
              />
              <Line type="monotone" dataKey="rating" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;