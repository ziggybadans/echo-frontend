// src/context/ChatContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Context for managing chat sessions, messages, and available AI models.
 */
export const ChatContext = createContext();

/**
 * Provider component that encapsulates chat-related state and functions.
 *
 * @param {React.ReactNode} children - Child components that consume the context.
 * @returns {JSX.Element} - The ChatContext provider wrapping children.
 */
export const ChatProvider = ({ children }) => {
  // Initialize chats from localStorage or as an empty array
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('chats');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse chats from localStorage:', error);
      return [];
    }
  });

  // Current active chat ID
  const [currentChatId, setCurrentChatId] = useState(() => {
    try {
      const saved = localStorage.getItem('currentChatId');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to parse currentChatId from localStorage:', error);
      return null;
    }
  });

  // Available AI models
  const [models, setModels] = useState([]);

  // Selected AI model ID
  const [selectedModelId, setSelectedModelId] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedModelId');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to parse selectedModelId from localStorage:', error);
      return null;
    }
  });

  /**
   * Fetches available AI models from the backend API.
   */
  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && !selectedModelId) {
        setSelectedModelId(data[0].id); // Select the first model by default
      }

      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]); // Clear models on error to prevent inconsistent state
    }
  }, [selectedModelId]);

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  /**
   * Persist chats to localStorage whenever chats state changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem('chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats to localStorage:', error);
    }
  }, [chats]);

  /**
   * Persist currentChatId to localStorage whenever it changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem('currentChatId', JSON.stringify(currentChatId));
    } catch (error) {
      console.error('Failed to save currentChatId to localStorage:', error);
    }
  }, [currentChatId]);

  /**
   * Persist selectedModelId to localStorage whenever it changes.
   */
  useEffect(() => {
    if (selectedModelId) {
      try {
        localStorage.setItem('selectedModelId', JSON.stringify(selectedModelId));
      } catch (error) {
        console.error('Failed to save selectedModelId to localStorage:', error);
      }
    }
  }, [selectedModelId]);

  /**
   * Adds a new chat session.
   *
   * @param {string} [name] - Optional name for the new chat. Defaults to "Chat X".
   */
  const addChat = (name = `Chat ${chats.length + 1}`) => {
    const newChat = {
      id: uuidv4(),
      name: name,
      messages: [],
      systemPrompt: '',
      model_id: selectedModelId, // Associate with selected model
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  /**
   * Updates an existing chat's details.
   *
   * @param {string} id - The unique identifier of the chat to update.
   * @param {object} updatedChat - The updated chat data.
   */
  const updateChat = (id, updatedChat) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === id ? { ...chat, ...updatedChat } : chat))
    );
  };

  /**
   * Adds a new message to a specific chat.
   *
   * @param {string} chatId - The unique identifier of the chat.
   * @param {object} message - The message object to add.
   */
  const addMessage = (chatId, message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, { ...message, text: String(message.text) }] }
          : chat
      )
    );
  };

  /**
   * Deletes a chat by its ID.
   *
   * @param {string} id - The unique identifier of the chat to delete.
   */
  const deleteChat = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    // If the deleted chat was the current one, reset currentChatId
    if (id === currentChatId) {
      setCurrentChatId(null);
    }
  };

  /**
   * Clears all chat sessions.
   */
  const clearChats = () => {
    setChats([]);
    setCurrentChatId(null);
  };

  /**
   * Updates a specific message within a chat.
   *
   * @param {string} chatId - The unique identifier of the chat.
   * @param {number} messageIndex - The index of the message to update.
   * @param {object} updatedMessage - The updated message data.
   */
  const updateMessage = (chatId, messageIndex, updatedMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg, idx) =>
                idx === messageIndex
                  ? { ...msg, text: String(updatedMessage.text) }
                  : msg
              ),
            }
          : chat
      )
    );
  };

  /**
   * Adds a new AI model to the available models list.
   *
   * @param {object} model - The model object to add.
   */
  const addModel = (model) => {
    setModels((prev) => [...prev, model]);
  };

  /**
   * Removes an AI model by its ID.
   *
   * @param {string} modelId - The unique identifier of the model to remove.
   */
  const removeModel = (modelId) => {
    setModels((prev) => prev.filter((model) => model.id !== modelId));
    // If the removed model was selected, select the first available model or null
    if (selectedModelId === modelId) {
      const remainingModels = models.filter((model) => model.id !== modelId);
      setSelectedModelId(remainingModels.length > 0 ? remainingModels[0].id : null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        addChat,
        updateChat,
        addMessage,
        updateMessage,
        deleteChat,
        clearChats,
        models,
        addModel,
        removeModel,
        selectedModelId,
        setSelectedModelId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
