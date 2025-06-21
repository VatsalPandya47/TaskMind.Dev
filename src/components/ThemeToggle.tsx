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
      className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 
                 transition-all duration-300 ease-in-out 
                 hover:bg-gray-300 dark:hover:bg-gray-600 
                 shadow-lg hover:shadow-xl 
                 flex items-center justify-center"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        right: '1rem', 
        zIndex: 9999 
      }}
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-gray-600" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-500" />
      )}
    </button>
  );
}; 