// src/context/CodeContext.js

import React, { createContext, useState, useCallback } from 'react';

/**
 * Context for managing the code-related sidebar, including visibility and current code content.
 */
export const CodeContext = createContext();

/**
 * Provider component that encapsulates code-related state and functions.
 *
 * @param {React.ReactNode} children - Child components that consume the context.
 * @returns {JSX.Element} - The CodeContext provider wrapping children.
 */
export const CodeProvider = ({ children }) => {
  // Indicates whether the code sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Holds the current code attachment details
  const [currentCode, setCurrentCode] = useState(null);

  /**
   * Displays the code sidebar with the provided code attachment.
   *
   * @param {object} codeAttachment - The code data to display in the sidebar.
   */
  const showCode = useCallback((codeAttachment) => {
    setCurrentCode(codeAttachment);
    setIsSidebarOpen(true);
  }, []);

  /**
   * Hides the code sidebar and clears the current code content.
   */
  const hideCode = useCallback(() => {
    setIsSidebarOpen(false);
    setCurrentCode(null);
  }, []);

  return (
    <CodeContext.Provider value={{ isSidebarOpen, currentCode, showCode, hideCode }}>
      {children}
    </CodeContext.Provider>
  );
};
