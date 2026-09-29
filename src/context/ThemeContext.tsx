import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'pacs-dark' | 'clinical-light' | 'midnight-blue';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('radiassist_theme') as ThemeMode) || 'pacs-dark';
  });

  useEffect(() => {
    localStorage.setItem('radiassist_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-pacs-dark', 'theme-clinical-light', 'theme-midnight-blue');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'pacs-dark') return 'clinical-light';
      if (prev === 'clinical-light') return 'midnight-blue';
      return 'pacs-dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
