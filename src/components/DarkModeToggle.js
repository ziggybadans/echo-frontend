// src/components/DarkModeToggle.js
import React from 'react';

function DarkModeToggle({ theme, toggleTheme }) {
  return (
    <div className="flex items-center justify-center">
      <span className="text-gray-800 dark:text-gray-200 mr-2">Dark Mode</span>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors duration-200 ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span className="sr-only">Toggle Dark Mode</span>
        <span
          className={`${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
        />
      </button>
    </div>
  );
}

export default DarkModeToggle;
