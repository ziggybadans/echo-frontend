import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { PlusIcon } from '@heroicons/react/solid';

function Sidebar() {
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    addChat,
  } = useContext(ChatContext);

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };

  const handleNewChat = () => {
    addChat(); // This function already sets the currentChatId
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Past Chats</h2>
        <button
          onClick={handleNewChat}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {chats.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400">No past chats.</li>
        )}
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`mb-2 cursor-pointer p-2 rounded ${
              chat.id === currentChatId
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSelectChat(chat.id)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;