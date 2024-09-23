// src/components/ChatItem.js

import React, { useContext, useState, useCallback } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/solid";
import { ChatContext } from "../context/ChatContext";

/**
 * Component representing a single chat item in the sidebar.
 *
 * @param {object} props - Component props.
 * @param {object} props.chat - The chat object containing chat details.
 * @returns {JSX.Element} The ChatItem component.
 */
function ChatItem({ chat }) {
  const { currentChatId, setCurrentChatId, deleteChat, updateChat } =
    useContext(ChatContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(chat.name);
  const [renameError, setRenameError] = useState(null);

  /**
   * Handles the selection of a chat.
   */
  const handleSelectChat = useCallback(() => {
    setCurrentChatId(chat.id);
    setIsEditing(false); // Exit edit mode if selecting the chat
  }, [setCurrentChatId, chat.id]);

  /**
   * Handles the deletion of a chat.
   *
   * @param {object} e - The event object.
   */
  const handleDeleteChat = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent triggering the chat selection
      deleteChat(chat.id);
    },
    [deleteChat, chat.id]
  );

  /**
   * Handles entering the edit mode for renaming a chat.
   *
   * @param {object} e - The event object.
   */
  const handleEditClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    setIsEditing(true);
  }, []);

  /**
   * Handles renaming the chat upon form submission.
   *
   * @param {object} e - The event object.
   */
  const handleRename = useCallback(
    (e) => {
      e.preventDefault();
      if (newName.trim() === "") {
        setRenameError("Chat name cannot be empty.");
        return;
      }
      updateChat(chat.id, { name: newName.trim() });
      setIsEditing(false);
      setRenameError(null);
    },
    [newName, updateChat, chat.id]
  );

  /**
   * Cancels the rename operation and resets the input field.
   */
  const handleCancelRename = useCallback(() => {
    setNewName(chat.name);
    setIsEditing(false);
    setRenameError(null);
  }, [chat.name]);

  return (
    <div
      className={`mb-2 cursor-pointer p-2 rounded ${
        chat.id === currentChatId
          ? "bg-blue-100 dark:bg-blue-900"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={!isEditing ? handleSelectChat : undefined} // Conditional onClick
      aria-current={chat.id === currentChatId ? "page" : undefined}
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
          <button
            type="submit"
            className="text-green-500 hover:text-green-700"
            title="Save"
          >
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
          <span className="text-black dark:text-white" title={chat.name}>
            {chat.name}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditClick}
              className="text-gray-500 hover:text-gray-700"
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
        <div className="text-red-500 text-sm mt-1" role="alert">
          {renameError}
        </div>
      )}
    </div>
  );
}

export default ChatItem;
