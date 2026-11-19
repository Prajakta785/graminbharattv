'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'cinema' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cinema',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always lock to White Theme as requested: "white ch theam thev"
  const theme: ThemeMode = 'light';

  useEffect(() => {
    document.documentElement.classList.add('light-mode');
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbtv_theme', 'light');
    }
  }, []);

  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
