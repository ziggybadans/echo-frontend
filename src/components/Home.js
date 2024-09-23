// src/components/Home.js

import React, { useContext, useCallback } from 'react';
import { ChatContext } from '../context/ChatContext';

/**
 * Home component displayed when no chat is active.
 * Provides a greeting and option to start a new chat.
 *
 * @returns {JSX.Element} The Home component.
 */
function Home() {
  const { addChat } = useContext(ChatContext);

  /**
   * Determines the greeting message based on the current time.
   *
   * @returns {string} The greeting message.
   */
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Ziggy';
    if (hour < 18) return 'Good Afternoon, Ziggy';
    return 'Good Evening, Ziggy';
  }, []);

  /**
   * Handles the action to start a new chat.
   */
  const handleStart = useCallback(() => {
    addChat('New Chat');
  }, [addChat]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        {getGreeting()}
      </h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
        onClick={handleStart}
        aria-label="Start a New Chat"
      >
        Start a New Chat
      </button>
    </div>
  );
}

export default Home;
