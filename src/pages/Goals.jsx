import React, { useState, useEffect } from 'react';
import { Target, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [category, setCategory] = useState('personal');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadGoals();
    }
  }, [currentUser]);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            text: newGoal,
            category,
            user_id: currentUser.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setGoals([data, ...goals]);
      setNewGoal('');
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const toggleGoal = async (id) => {
    try {
      const goal = goals.find(g => g.id === id);
      const { error } = await supabase
        .from('goals')
        .update({ completed: !goal.completed })
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <Target className="w-8 h-8 mr-3" />
        Couple Goals
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter a new goal..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              required
            />
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="personal">Personal</option>
              <option value="relationship">Relationship</option>
              <option value="travel">Travel</option>
              <option value="financial">Financial</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Goal
        </button>
      </form>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex items-center justify-between ${
              goal.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`p-2 rounded-full ${
                  goal.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <Check className={`w-5 h-5 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} />
              </button>
              <div>
                <p className={`text-gray-900 dark:text-white ${goal.completed ? 'line-through' : ''}`}>
                  {goal.text}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {goal.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals;