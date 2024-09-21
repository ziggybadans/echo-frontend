// src/context/CodeContext.js
import React, { createContext, useState } from 'react';

export const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState(null);

  const showCode = (codeAttachment) => {
    setCurrentCode(codeAttachment);
    setIsSidebarOpen(true);
  };

  const hideCode = () => {
    setIsSidebarOpen(false);
    setCurrentCode(null);
  };

  return (
    <CodeContext.Provider value={{ isSidebarOpen, currentCode, showCode, hideCode }}>
      {children}
    </CodeContext.Provider>
  );
};
