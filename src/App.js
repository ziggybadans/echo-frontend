// src/App.js
import React from "react";
import Home from "./components/Home";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import { ChatProvider, ChatContext } from "./context/ChatContext";
import { CodeProvider } from "./context/CodeContext";
import { ThemeProvider } from "./context/ThemeContext";
import CodeSidebar from "./components/CodeSidebar";

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <CodeProvider>
          <div className="flex h-screen bg-[#eeeeee] dark:bg-[#161618]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <MainContent />
              <CodeSidebar/>
            </div>
          </div>
        </CodeProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}

function MainContent() {
  const { currentChatId } = React.useContext(ChatContext);

  return (
    <div className="flex-1 flex flex-col">
      {currentChatId ? <ChatInterface /> : <Home />}
    </div>
  );
}

export default App;
