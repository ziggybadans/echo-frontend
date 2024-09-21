import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : [];
  });

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
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === id ? { ...chat, ...updatedChat } : chat))
    );
  };

  const addMessage = (id, message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const clearChats = () => {
    setChats([]);
    setCurrentChatId(null);
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
        clearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};