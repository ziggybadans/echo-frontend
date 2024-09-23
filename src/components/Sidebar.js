// src/components/Sidebar.js

import React, { useContext, useState, useCallback } from "react";
import { ChatContext } from "../context/ChatContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { ThemeContext } from "../context/ThemeContext";
import ChatItem from "./ChatItem";
import DarkModeToggle from "./DarkModeToggle";
import ConfirmModal from "./ConfirmModal";
import ModelList from "./ModelList"; // Import the ModelList component

/**
 * Sidebar component containing the list of past chats, model management, and theme toggling.
 *
 * @returns {JSX.Element} The Sidebar component.
 */
function Sidebar() {
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    addChat,
    deleteChat,
    updateChat,
    clearChats,
    models,
  } = useContext(ChatContext);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For deleting all chats

  /**
   * Handles initiating a new chat by resetting the current session.
   */
  const handleNewChat = useCallback(async () => {
    setIsResetting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reset chat.");
      }

      const data = await response.json();
      console.log(data.status);

      addChat("New Chat");
      setCurrentChatId(null);
    } catch (err) {
      console.error("Error resetting chat:", err);
      setError("Unable to reset the chat. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }, [addChat, setCurrentChatId]);

  /**
   * Navigates back to the home screen by deselecting the current chat.
   */
  const handleGoHome = useCallback(() => {
    setCurrentChatId(null);
  }, [setCurrentChatId]);

  /**
   * Opens the confirmation modal for deleting all chats.
   */
  const handleDeleteAllChats = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Confirms the deletion of all chats.
   */
  const confirmDeleteAllChats = useCallback(() => {
    clearChats();
    setIsModalOpen(false);
  }, [clearChats]);

  /**
   * Cancels the deletion of all chats.
   */
  const cancelDeleteAllChats = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="w-72 bg-gray-100 dark:bg-zinc-900 border-r dark:border-gray-700 p-4 flex flex-col">
      {/* Chatbot Name "Echo" at the top */}
      <div
        className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer truncate"
        onClick={handleGoHome}
        title="Go to Home"
        aria-label="Go to Home"
      >
        Echo
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Past Chats
        </h2>
        <button
          onClick={handleNewChat}
          className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center focus:outline-none ${
            isResetting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Start New Chat"
          aria-label="Start New Chat"
          disabled={isResetting}
        >
          {isResetting ? "Resetting..." : <PlusIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <ul className="flex-1 overflow-y-auto space-y-2">
        {chats.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400">No past chats.</li>
        )}
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </ul>

      {/* Delete All Chats Button */}
      {chats.length > 0 && (
        <button
          onClick={handleDeleteAllChats}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center focus:outline-none"
          title="Delete All Chats"
          aria-label="Delete All Chats"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Delete All
        </button>
      )}

      {/* Confirm Modal */}
      {isModalOpen && (
        <ConfirmModal
          title="Delete All Chats"
          message="Are you sure you want to delete all chats? This action cannot be undone."
          onConfirm={confirmDeleteAllChats}
          onCancel={cancelDeleteAllChats}
        />
      )}

      {/* Model List */}
      <ModelList />

      {/* Dark Mode Toggle at the bottom */}
      <div className="mt-4">
        <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

export default Sidebar;
