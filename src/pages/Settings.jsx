import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, Sun, Moon, LogOut } from 'lucide-react';

function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <SettingsIcon className="w-8 h-8 mr-3" />
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h2>
              <p className="text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account</h2>
              <p className="text-gray-500 dark:text-gray-400">Sign out of your account</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;