// src/context/ThemeContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * Context for managing the application's theme (light or dark).
 */
export const ThemeContext = createContext();

/**
 * Provider component that encapsulates theme-related state and functions.
 *
 * @param {React.ReactNode} children - Child components that consume the context.
 * @returns {JSX.Element} - The ThemeContext provider wrapping children.
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved ? JSON.parse(saved) : 'light';
    } catch (error) {
      console.error('Failed to parse theme from localStorage:', error);
      return 'light';
    }
  });

  /**
   * Updates the theme in localStorage and toggles the 'dark' class on the document root.
   */
  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
