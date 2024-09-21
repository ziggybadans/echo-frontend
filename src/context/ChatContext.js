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

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('currentChatId', JSON.stringify(currentChatId));
  }, [currentChatId]);

  const addChat = (name = `Chat ${chats.length + 1}`) => {
    const newChat = {
      id: uuidv4(),
      name: name,
      messages: [],
      systemPrompt: '',
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
                  ? { ...msg, text: String(updatedMessage.text) } // Ensure text is string
                  : msg
              ),
            }
          : chat
      )
    );
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
        updateMessage, // Add updateMessage to context
        deleteChat,
        clearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};