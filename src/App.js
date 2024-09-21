import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import { ChatProvider, ChatContext } from './context/ChatContext';

function App() {
  const [theme, setTheme] = useState('light');

  // Handle theme based on user preference
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MainContent />
          <Settings theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </ChatProvider>
  );
}

function MainContent() {
  const { currentChatId } = React.useContext(ChatContext);

  return (
    <>
      {currentChatId ? <ChatInterface /> : <Home />}
    </>
  );
}

export default App;