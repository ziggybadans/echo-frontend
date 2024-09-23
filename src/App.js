// src/App.js

import React from "react";
import Home from "./components/Home";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import { ChatProvider, ChatContext } from "./context/ChatContext";
import { CodeProvider } from "./context/CodeContext";
import CodeSidebar from "./components/CodeSidebar";

/**
 * Main application component.
 * Wraps the application with necessary providers and renders the layout.
 */
function App() {
  return (
    <ChatProvider>
      <CodeProvider>
        <div className="flex h-screen bg-gray-200 dark:bg-gray-800">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <MainContent />
            <CodeSidebar />
          </div>
        </div>
      </CodeProvider>
    </ChatProvider>
  );
}

/**
 * Determines which main content to display based on the current chat session.
 */
function MainContent() {
  const { currentChatId } = React.useContext(ChatContext);

  return (
    <div className="flex-1 flex flex-col">
      {currentChatId ? <ChatInterface /> : <Home />}
    </div>
  );
}

export default App;
