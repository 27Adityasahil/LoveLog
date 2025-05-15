import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function Gallery() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadImages();
    }
  }, [currentUser]);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([
          {
            title,
            url,
            user_id: currentUser.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setImages([data, ...images]);
      setTitle('');
      setUrl('');
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <ImageIcon className="w-8 h-8 mr-3" />
        Memory Gallery
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Image
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;