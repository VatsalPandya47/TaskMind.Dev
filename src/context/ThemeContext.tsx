import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage, default to system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    console.log('Saved Theme from localStorage:', savedTheme);
    
    if (savedTheme) return savedTheme;
    
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System Preferred Theme:', isDarkMode ? 'dark' : 'light');
    
    return isDarkMode ? 'dark' : 'light';
  });

  useEffect(() => {
    console.log('Theme Changed:', theme);
    
    // Apply theme class to root element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('Toggling Theme');
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New Theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 