import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    console.log('Current Theme:', theme);
  }, [theme]);

  return (
    <button 
      onClick={toggleTheme} 
      className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50
                 transition-all duration-300 ease-in-out 
                 hover:bg-gray-700/80 hover:scale-110
                 shadow-lg hover:shadow-xl 
                 flex items-center justify-center
                 text-white hover:text-yellow-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        right: '1rem', 
        zIndex: 9999 
      }}
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-blue-400" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-400" />
      )}
    </button>
  );
}; 