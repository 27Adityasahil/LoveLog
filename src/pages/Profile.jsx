import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useJournal } from '../contexts/JournalContext';
import { User, Mail, Image as ImageIcon, Pencil, X, UserPlus, Heart, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Profile() {
  const { currentUser } = useAuth();
  const { entries } = useJournal();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerConnection, setPartnerConnection] = useState(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [loveNote, setLoveNote] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadProfile();
      loadPartnerConnection();
    }
  }, [currentUser]);

  async function loadProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setName(data?.name || '');
      setAvatarUrl(data?.avatar_url || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function loadPartnerConnection() {
    try {
      const { data: connections, error: connectionError } = await supabase
        .from('partner_connections')
        .select('*, users!partner_connections_partner_id_fkey(id, name, avatar_url)')
        .or(`user_id.eq.${currentUser.id},partner_id.eq.${currentUser.id}`);

      if (connectionError) throw connectionError;

      if (connections && connections.length > 0) {
        const connection = connections[0];
        setPartnerConnection(connection);
        
        // Get partner profile based on whether the current user is user_id or partner_id
        const partner = connection.user_id === currentUser.id 
          ? connection.users 
          : await getUserProfile(connection.user_id);
        
        setPartnerProfile(partner);
      }
    } catch (error) {
      console.error('Error loading partner connection:', error);
    }
  }

  async function getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async function updateProfile(e) {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          avatar_url: avatarUrl
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

  async function handleAvatarUpload(e) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${currentUser.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      await loadProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function connectWithPartner(e) {
    e.preventDefault();
    try {
      // Find partner user by email from auth.users
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
        filters: {
          email: partnerEmail
        }
      });

      if (userError || !users.length) {
        throw new Error('User not found');
      }

      const partnerUser = users[0];

      // Create partner connection
      const { error: connectionError } = await supabase
        .from('partner_connections')
        .insert({
          user_id: currentUser.id,
          partner_id: partnerUser.id,
          status: 'pending'
        });

      if (connectionError) throw connectionError;

      setPartnerEmail('');
      await loadPartnerConnection();
      alert('Partner connection request sent!');
    } catch (error) {
      console.error('Error connecting with partner:', error);
      alert('Failed to send partner request. Please check the email and try again.');
    }
  }

  async function acceptPartnerRequest() {
    try {
      const { error } = await supabase
        .from('partner_connections')
        .update({ status: 'accepted' })
        .match({ id: partnerConnection.id });

      if (error) throw error;

      await loadPartnerConnection();
    } catch (error) {
      console.error('Error accepting partner request:', error);
      alert('Failed to accept partner request. Please try again.');
    }
  }

  async function sendLoveNote() {
    try {
      const { error } = await supabase
        .from('love_notes')
        .insert({
          sender_id: currentUser.id,
          receiver_id: partnerProfile.id,
          content: loveNote
        });

      if (error) throw error;

      setLoveNote('');
      alert('Love note sent!');
    } catch (error) {
      console.error('Error sending love note:', error);
      alert('Failed to send love note. Please try again.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <User className="w-8 h-8 mr-3" />
            Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label className="absolute inset-0 w-full h-full rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="text-white text-sm">Change Photo</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uploading ? 'Uploading...' : 'Click to upload new image'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              disabled={uploading}
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=random`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile?.name || 'User'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Partner Connection Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-pink-500" />
          Partner Connection
        </h2>

        {!partnerConnection && (
          <form onSubmit={connectWithPartner} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Connect with Your Partner
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="Enter your partner's email"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </button>
              </div>
            </div>
          </form>
        )}

        {partnerConnection?.status === 'pending' && partnerConnection.partner_id === currentUser.id && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              {partnerProfile?.name || 'Someone'} wants to connect with you!
            </p>
            <button
              onClick={acceptPartnerRequest}
              className="mt-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept Request
            </button>
          </div>
        )}

        {partnerConnection?.status === 'pending' && partnerConnection.user_id === currentUser.id && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Waiting for {partnerProfile?.name || 'your partner'} to accept your request...
            </p>
          </div>
        )}

        {partnerConnection?.status === 'accepted' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={partnerProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerProfile?.name || 'Partner')}&background=random`}
                alt="Partner"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {partnerProfile?.name || 'Partner'}
                </h3>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Send a Love Note
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={loveNote}
                  onChange={(e) => setLoveNote(e.target.value)}
                  placeholder="Write something sweet..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
                <button
                  onClick={sendLoveNote}
                  disabled={!loveNote.trim()}
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Journal Entries Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <ImageIcon className="w-6 h-6 mr-2" />
          My Journal Entries
        </h2>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {entry.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {entry.content}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No journal entries yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;