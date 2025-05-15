import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Heart, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;
      setUserName(data.name || 'User');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Love Log
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/journal" className="nav-link">Journal</Link>
                <Link to="/mood" className="nav-link">Mood</Link>
                <Link to="/gallery" className="nav-link">Gallery</Link>
                <Link to="/goals" className="nav-link">Goals</Link>
                <Link to="/gratitude" className="nav-link">Gratitude</Link>
                <Link to="/profile" className="nav-link flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {userName}
                </Link>
                <button onClick={handleLogout} className="nav-link">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-gray-200" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                <Link to="/journal" className="mobile-nav-link">Journal</Link>
                <Link to="/mood" className="mobile-nav-link">Mood</Link>
                <Link to="/gallery" className="mobile-nav-link">Gallery</Link>
                <Link to="/goals" className="mobile-nav-link">Goals</Link>
                <Link to="/gratitude" className="mobile-nav-link">Gratitude</Link>
                <Link to="/profile" className="mobile-nav-link flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {userName}
                </Link>
                <button onClick={handleLogout} className="mobile-nav-link w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link">Login</Link>
                <Link to="/register" className="mobile-nav-link">Register</Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="mobile-nav-link w-full flex items-center"
            >
              {darkMode ? (
                <>
                  <Sun className="h-5 w-5 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;