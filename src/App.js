// src/App.js
import React from 'react';
import Home from './components/Home';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { ChatProvider, ChatContext } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="flex h-screen bg-[#eeeeee] dark:bg-[#161618]">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <MainContent />
          </div>
        </div>
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
