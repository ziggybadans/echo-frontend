import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { Switch } from '@headlessui/react';

function Settings({ theme, setTheme }) {
  const { chats, currentChatId, updateChat } = useContext(ChatContext);
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const [enabled, setEnabled] = useState(theme === 'dark');
  const [systemPrompt, setSystemPrompt] = useState(currentChat?.systemPrompt || '');

  const toggleTheme = () => {
    setEnabled(!enabled);
    setTheme(enabled ? 'light' : 'dark');
  };

  const handleSavePrompt = () => {
    if (currentChatId) {
      updateChat(currentChatId, { systemPrompt });
    }
  };

  if (!currentChat) {
    return null; // Or provide alternative UI
  }

  return (
    <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-4">
        <Switch
          checked={enabled}
          onChange={toggleTheme}
          className={`${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
            relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">Toggle Theme</span>
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
        <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
      </div>
      <div>
        <label htmlFor="systemPrompt" className="text-gray-800 dark:text-gray-200">
          System Prompt:
        </label>
        <textarea
          id="systemPrompt"
          className="w-full p-2 border rounded-lg mt-2 dark:bg-gray-800 dark:text-gray-200"
          rows="3"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
        <button
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleSavePrompt}
        >
          Save Prompt
        </button>
      </div>
    </div>
  );
}

export default Settings;