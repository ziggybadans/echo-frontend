import React, { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';
import CodeModal from './CodeModal';

function ChatInterface() {
  const {
    chats,
    currentChatId,
    addMessage,
  } = useContext(ChatContext);
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const [message, setMessage] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim() || !currentChatId) return;

    const userMessage = { sender: 'user', text: message };
    addMessage(currentChatId, userMessage);
    setMessage('');
    scrollToBottom();

    // Send the message to the backend
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      const data = await response.json();
      const responseText = data.response;

      // Check if the response contains code blocks
      const codeMatch = responseText.match(/```(?:\w+\n)?([\s\S]*?)```/);
      if (codeMatch) {
        setCodeContent(codeMatch[1]);
        setIsCodeModalOpen(true);
      }

      const botMessage = { sender: 'bot', text: responseText };
      addMessage(currentChatId, botMessage);
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      addMessage(currentChatId, errorMessage);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentChat) {
    return <div className="flex-1 p-4">No active chat. Please start a new chat.</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        {currentChat.messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <textarea
          className="w-full p-2 border rounded-lg resize-none dark:bg-gray-800 dark:text-gray-200"
          rows="2"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="mt-2 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
      {isCodeModalOpen && (
        <CodeModal code={codeContent} setIsCodeModalOpen={setIsCodeModalOpen} />
      )}
    </div>
  );
}

export default ChatInterface;