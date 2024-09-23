// src/components/Sidebar.js
import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { ThemeContext } from "../context/ThemeContext";
import ChatItem from "./ChatItem";
import DarkModeToggle from "./DarkModeToggle";
import ConfirmModal from "./ConfirmModal";
import ModelList from "./ModelList"; // Import the ModelList component

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

  const handleNewChat = async () => {
    setIsResetting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/reset", {
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
  };

  const handleGoHome = () => {
    setCurrentChatId(null);
  };

  const handleDeleteAllChats = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteAllChats = () => {
    clearChats();
    setIsModalOpen(false);
  };

  const cancelDeleteAllChats = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-72 bg-gray-100 dark:bg-zinc-900 border-r dark:border-gray-700 p-4 flex flex-col">
      {/* Chatbot Name "Echo" at the top */}
      <div
        className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
        onClick={handleGoHome}
      >
        Echo
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Past Chats
        </h2>
        <button
          onClick={handleNewChat}
          className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center ${
            isResetting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Start New Chat"
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
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
          title="Delete All Chats"
        >
          <TrashIcon className="h-5 w-5" />
          <span className="ml-2">Delete All</span>
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