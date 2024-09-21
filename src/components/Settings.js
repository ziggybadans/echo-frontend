import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';

function Settings({ theme, setTheme }) {
  const { chats, currentChatId, updateChat } = useContext(ChatContext);
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const [systemPrompt, setSystemPrompt] = useState(currentChat?.systemPrompt || '');

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