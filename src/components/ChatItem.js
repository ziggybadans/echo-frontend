// src/components/ChatItem.js
import React, { useContext, useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { ChatContext } from '../context/ChatContext';

function ChatItem({ chat }) {
  const { currentChatId, setCurrentChatId, deleteChat, updateChat } = useContext(ChatContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(chat.name);
  const [renameError, setRenameError] = useState(null);

  const handleSelectChat = () => {
    setCurrentChatId(chat.id);
    setIsEditing(false); // Exit edit mode if selecting the chat
  };

  const handleDeleteChat = (e) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    deleteChat(chat.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    setIsEditing(true);
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (newName.trim() === '') {
      setRenameError('Chat name cannot be empty.');
      return;
    }
    console.log(`Renaming chat ID: ${chat.id} to "${newName.trim()}"`); // Debug log
    updateChat(chat.id, { name: newName.trim() });
    setIsEditing(false);
    setRenameError(null);
  };

  const handleCancelRename = () => {
    setNewName(chat.name);
    setIsEditing(false);
    setRenameError(null);
  };

  return (
    <div
      className={`mb-2 cursor-pointer p-2 rounded ${
        chat.id === currentChatId
          ? 'bg-blue-100 dark:bg-blue-900'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={!isEditing ? handleSelectChat : undefined} // Conditional onClick
    >
      {isEditing ? (
        <form onSubmit={handleRename} className="flex items-center space-x-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 min-w-0 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-300 dark:bg-zinc-800 dark:text-white"
            autoFocus
          />
          <button type="submit" className="text-green-500 hover:text-green-700" title="Save">
            <CheckIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleCancelRename}
            className="text-gray-500 hover:text-gray-700"
            title="Cancel"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-black dark:text-white">{chat.name}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditClick}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400"
              title="Rename Chat"
              aria-label="Rename Chat"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDeleteChat}
              className="text-red-500 hover:text-red-700"
              title="Delete Chat"
              aria-label="Delete Chat"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {renameError && (
        <div className="text-red-500 text-sm mt-1">
          {renameError}
        </div>
      )}
    </div>
  );
}

export default ChatItem;
