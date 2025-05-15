import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, PenLine, Calendar, Image, Target, MessageCircle, Music, Gift, Star } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/journal');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <PenLine className="w-6 h-6" />,
      title: 'Journal Together',
      description: 'Share your daily thoughts and experiences with your loved one in a private, intimate space.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Track Moods',
      description: 'Monitor your emotional journey as a couple and grow closer through understanding.'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Remember Milestones',
      description: 'Never miss important dates and anniversaries. Celebrate your love story\'s special moments.'
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: 'Share Memories',
      description: 'Create a beautiful gallery of your precious moments together, from first dates to adventures.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Set Goals Together',
      description: 'Plan your future together. Whether it\'s travel dreams or life goals, achieve them as one.'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Love Notes',
      description: 'Send sweet messages and reminders to brighten each other\'s day, anytime, anywhere.'
    }
  ];

  const testimonials = [
    {
      quote: "This journal has brought us closer than ever. We love writing our daily entries together!",
      author: "Sarah & Mike",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      quote: "The mood tracker helped us understand each other better. It's like having a relationship superpower!",
      author: "Emily & James",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <Heart className="w-12 h-12 text-pink-600 fill-current" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 mt-12">
          Your Love Story,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Digitally Preserved
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          A private space for couples to journal, share memories, and grow together. Start writing your story today.
        </p>
        <motion.div 
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {currentUser ? 'Go to Journal' : 'Get Started'}
          </button>
          {!currentUser && (
            <Link
              to="/login"
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-200 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </motion.div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 mb-20">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="text-pink-600 dark:text-pink-400 mb-4 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg inline-block">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mb-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 transform skew-y-3 rounded-3xl -z-10 opacity-10"></div>
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{testimonial.author}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center mb-20"
      >
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Couple writing in journal"
          className="rounded-2xl shadow-2xl mx-auto max-w-full"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mb-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-12 text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-8 opacity-90">Begin writing your love story today. Every moment matters.</p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
        >
          {currentUser ? 'Create Your Entry' : 'Create Your Journal'}
        </button>
      </motion.div>
    </div>
  );
}

export default Home;