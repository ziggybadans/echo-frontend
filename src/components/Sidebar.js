// src/components/Sidebar.js
import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { ThemeContext } from '../context/ThemeContext';

function Sidebar() {
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    addChat,
    deleteChat,
  } = useContext(ChatContext);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };

  const handleNewChat = async () => {
    setIsResetting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset chat.');
      }

      const data = await response.json();
      console.log(data.status); // Optional: Handle the response as needed

      addChat('New Chat');
      setCurrentChatId(null); // Optionally set to the new chat's ID if returned
    } catch (err) {
      console.error('Error resetting chat:', err);
      setError('Unable to reset the chat. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    deleteChat(id);
  };

  const handleGoHome = () => {
    setCurrentChatId(null);
  };

  return (
    <div className="w-64 bg-gray-100 dark:bg-zinc-900 border-r dark:border-gray-700 p-4 flex flex-col">
      {/* Chatbot Name "Echo" at the top */}
      <div
        className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
        onClick={handleGoHome}
      >
        Echo
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Past Chats</h2>
        <button
          onClick={handleNewChat}
          className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center ${
            isResetting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Start New Chat"
          disabled={isResetting}
        >
          {isResetting ? 'Resetting...' : <PlusIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <ul className="flex-1 overflow-y-auto">
        {chats.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400">No past chats.</li>
        )}
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`mb-2 cursor-pointer p-2 rounded flex justify-between items-center ${
              chat.id === currentChatId
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <span className='text-black dark:text-white'>{chat.name}</span>
            <button
              onClick={(e) => handleDeleteChat(e, chat.id)}
              className="text-red-500 hover:text-red-700"
              title="Delete Chat"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Dark Mode Toggle at the bottom */}
      <div className="mt-4">
        <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

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

export default Sidebar;