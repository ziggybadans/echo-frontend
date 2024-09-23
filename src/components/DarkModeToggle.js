// src/components/DarkModeToggle.js

import React, { useCallback } from 'react';

/**
 * Toggle switch for switching between light and dark modes.
 *
 * @param {object} props - Component props.
 * @param {string} props.theme - Current theme ('light' or 'dark').
 * @param {function} props.toggleTheme - Function to toggle the theme.
 * @returns {JSX.Element} The DarkModeToggle component.
 */
function DarkModeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  /**
   * Handles the toggle action when the switch is clicked.
   */
  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors duration-200 ${
          isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        aria-label="Toggle Dark Mode"
        aria-pressed={isDark}
      >
        <span className="sr-only">Toggle Dark Mode</span>
        <span
          className={`transform transition-transform duration-200 ${
            isDark ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 bg-white rounded-full`}
        />
      </button>
    </div>
  );
}

export default DarkModeToggle;
