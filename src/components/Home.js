import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

function Home() {
  const { addChat } = useContext(ChatContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const handleStart = () => {
    addChat('New Chat');
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">{getGreeting()}</h1>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={handleStart}
      >
        Start a New Chat
      </button>
    </div>
  );
}

export default Home;