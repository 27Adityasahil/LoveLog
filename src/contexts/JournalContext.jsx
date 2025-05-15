import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const JournalContext = createContext();

export function useJournal() {
  return useContext(JournalContext);
}

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [currentUser]);

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading journal entries:', error);
      return;
    }

    setEntries(data);
  };

  const addEntry = async (entry) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          title: entry.title,
          content: entry.content,
          user_id: currentUser.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding journal entry:', error);
      return;
    }

    setEntries(prevEntries => [data, ...prevEntries]);
  };

  const deleteEntry = async (entryId) => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting journal entry:', error);
      return;
    }

    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
  };

  const updateEntry = async (entryId, updatedEntry) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        title: updatedEntry.title,
        content: updatedEntry.content
      })
      .eq('id', entryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating journal entry:', error);
      return;
    }

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId ? data : entry
      )
    );
  };

  const value = {
    entries,
    addEntry,
    deleteEntry,
    updateEntry
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}