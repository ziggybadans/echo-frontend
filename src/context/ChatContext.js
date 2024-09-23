// src/context/ChatContext.js
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('chats');
    if (saved) {
      const parsedChats = JSON.parse(saved).map(chat => ({
        ...chat,
        messages: chat.messages.map(msg => ({
          ...msg,
          text: String(msg.text) // Ensure text is string
        }))
      }));
      setChats(parsedChats);
    } else {
      setChats([]);
    }
  }, []);

  const [currentChatId, setCurrentChatId] = useState(() => {
    const saved = localStorage.getItem('currentChatId');
    return saved ? JSON.parse(saved) : null;
  });

  const [models, setModels] = useState([]); // List of available models
  const [selectedModelId, setSelectedModelId] = useState(() => {
    const saved = localStorage.getItem('selectedModelId');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch models from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:8000/api/models')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched models:', data); // Debugging line
        if (Array.isArray(data) && data.length > 0 && !selectedModelId) {
          setSelectedModelId(data[0].id); // Select the first model by default
        }
        setModels(data);
      })
      .catch((error) => {
        console.error('Error fetching models:', error);
        setModels([]); // Prevent `.map` errors
      });
  }, []);

  // Persist chats to localStorage
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // Persist currentChatId to localStorage
  useEffect(() => {
    localStorage.setItem('currentChatId', JSON.stringify(currentChatId));
  }, [currentChatId]);

  // Persist selectedModelId to localStorage
  useEffect(() => {
    if (selectedModelId) {
      localStorage.setItem('selectedModelId', JSON.stringify(selectedModelId));
    }
  }, [selectedModelId]);

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

  const updateChat = (id, updatedChat) => {
    console.log(`Updating chat with ID: ${id}`, updatedChat); // Add this line
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === id ? { ...chat, ...updatedChat } : chat))
    );
  };

  const addMessage = (id, message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, messages: [...chat.messages, { ...message, text: String(message.text) }] }
          : chat
      )
    );
  };

  const deleteChat = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    // If the deleted chat was the current one, reset currentChatId
    if (id === currentChatId) {
      setCurrentChatId(null);
    }
  };

  const clearChats = () => {
    setChats([]);
    setCurrentChatId(null);
  };

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

  const addModel = (model) => {
    setModels((prev) => [...prev, model]);
  };

  const removeModel = (modelId) => {
    setModels((prev) => prev.filter((model) => model.id !== modelId));
    // Optionally, handle chat associations if the removed model was in use
    if (selectedModelId === modelId) {
      setSelectedModelId(models.length > 0 ? models[0].id : null);
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
