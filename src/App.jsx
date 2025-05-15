import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { JournalProvider } from './contexts/JournalContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import Gallery from './pages/Gallery';
import Goals from './pages/Goals';
import Gratitude from './pages/Gratitude';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <JournalProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/mood" element={<MoodTracker />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/gratitude" element={<Gratitude />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </JournalProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;