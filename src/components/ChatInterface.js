// src/components/ChatInterface.js
import React, { useState, useContext, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import CodeModal from "./CodeModal";
import InlineCodeEditor from "./InlineCodeEditor";
import { escapeHtml } from "../utils/escapeHtml";

function ChatInterface() {
  const { chats, currentChatId, addMessage, updateChat } = useContext(ChatContext);
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const [message, setMessage] = useState("");
  const [codeAttachments, setCodeAttachments] = useState([]);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [currentEditingCode, setCurrentEditingCode] = useState(null);

  const addCodeAttachment = ({ codeContent, fileName, notes }) => {
    const escapedCode = escapeHtml(codeContent);
    const escapedFileName = escapeHtml(fileName || "untitled");
    const escapedNotes = escapeHtml(notes || "");
    const codeTag = `<code fileName="${escapedFileName}" notes="${escapedNotes}">${escapedCode}</code>`;
    setMessage((prev) => prev + codeTag);
  };

  const handleAttachCode = (codeSegment) => {
    setCurrentEditingCode(codeSegment);
    setIsCodeModalOpen(true);
  };

  const handleCodeSave = (updatedCode) => {
    if (currentEditingCode) {
      // Update existing code
      const regex = new RegExp(`<code fileName="${currentEditingCode.fileName}" notes="${currentEditingCode.notes}">[^<]*</code>`);
      const updatedMessage = message.replace(regex, 
        `<code fileName="${updatedCode.fileName}" notes="${updatedCode.notes}">${escapeHtml(updatedCode.codeContent)}</code>`
      );
      setMessage(updatedMessage);
    } else {
      // Add new code
      addCodeAttachment(updatedCode);
    }
    setIsCodeModalOpen(false);
    setCurrentEditingCode(null);
  };

  const updateCodeAttachment = (index, updatedAttachment) => {
    setCodeAttachments((prev) =>
      prev.map((attachment, i) => (i === index ? updatedAttachment : attachment))
    );
    // Also update the message text to reflect changes
    const { codeContent, fileName, notes } = updatedAttachment;
    const updatedCodeTag = `<code fileName="${escapeHtml(fileName || "untitled")}" notes="${escapeHtml(notes || "")}">\n${escapeHtml(codeContent)}\n</code>`;
    setMessage((prev) => {
      const regex = /<code\s+fileName="[^"]*"\s+notes="[^"]*">\n[\s\S]*?\n<\/code>/;
      return prev.replace(regex, updatedCodeTag);
    });
  };

  const deleteCodeAttachment = (index) => {
    setCodeAttachments((prev) => prev.filter((_, i) => i !== index));
    // Also remove the code tag from the message text
    setMessage((prev) => prev.replace(/<code\s+fileName="[^"]*"\s+notes="[^"]*">\n[\s\S]*?\n<\/code>/, '').trim());
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatConversation = (messages, systemPrompt, maxMessages = 10) => {
    let formatted = systemPrompt ? `${systemPrompt}\n\n` : "";
    const recentMessages = messages.slice(-maxMessages);
    recentMessages.forEach((msg) => {
      if (msg.sender === "user") {
        formatted += `User: ${String(msg.text)}\n`;
      } else if (msg.sender === "bot") {
        formatted += `Bot: ${String(msg.text)}\n`;
      }
    });
    return formatted;
  };

  const handleSend = async () => {
    if (!message.trim() || !currentChatId) return;
  
    const userMessage = { sender: 'user', text: message };
    addMessage(currentChatId, userMessage);
    setMessage('');
    setCodeAttachments([]);
    scrollToBottom();
  
    // Set typing indicator
    setIsTyping(true);
  
    // Aggregate all messages for context
    const allMessages = currentChat.messages.concat(userMessage);
    const formattedConversation = formatConversation(
      allMessages,
      currentChat.systemPrompt
    );

    console.log("Formatted Conversation:", formattedConversation);

    // Send the aggregated conversation to the backend
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formattedConversation }),
      });
      const data = await response.json();
      const responseText = data.response;

      // Check if the response contains code blocks
      const codeMatch = responseText.match(/```(?:\w+\n)?([\s\S]*?)```/);
      if (codeMatch) {
        // Uncomment if you want to handle code blocks
        // setCodeContent(codeMatch[1]);
        // setIsCodeModalOpen(true);
      }

      const botMessage = { sender: "bot", text: responseText };
      addMessage(currentChatId, botMessage);
      scrollToBottom();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
      };
      addMessage(currentChatId, errorMessage);
      scrollToBottom();
    } finally {
      // Remove typing indicator
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSystemPromptChange = (e) => {
    const newPrompt = e.target.value;
    updateChat(currentChatId, { systemPrompt: newPrompt });
  };

  const toggleSystemPrompt = () => {
    setIsSystemPromptOpen(!isSystemPromptOpen);
  };

  if (!currentChat) {
    return (
      <div className="flex-1 p-4">No active chat. Please start a new chat.</div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-32 pt-8 pb-8 overflow-y-auto bg-[#eeeeee] dark:bg-[#161618]">
        {currentChat.messages.map((msg, index) => (
          <Message
            key={index}
            chatId={currentChatId}
            messageIndex={index}
            sender={msg.sender}
            text={msg.text}
          />
        ))}
        {isTyping && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center">
              <div className="flex space-x-1 mr-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-custom animation-delay-0"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-custom animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce-custom animation-delay-400"></div>
              </div>
              <span className="text-sm">Echo is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        id="message_area"
        className="p-4 border-t dark:border-gray-700 bg-white dark:bg-[#161618]"
      >
        <button
          onClick={toggleSystemPrompt}
          className="mb-2 text-sm text-blue-500 hover:underline focus:outline-none"
        >
          {isSystemPromptOpen ? "Hide System Prompt" : "Show System Prompt"}
        </button>
        {isSystemPromptOpen && (
          <textarea
            className="w-full p-2 border rounded-lg resize-none dark:bg-gray-800 dark:text-gray-200 mb-2"
            rows="3"
            placeholder="Enter system prompt..."
            value={currentChat.systemPrompt}
            onChange={handleSystemPromptChange}
          />
        )}
        <div className="flex flex-col">
          <InlineCodeEditor
            value={message}
            onChange={setMessage}
            onAttachCode={handleAttachCode}
          />
          <div className="flex items-center mt-2">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="mr-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
            >
              Attach Code
            </button>
            <button
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {isCodeModalOpen && (
        <CodeModal
          onClose={() => {
            setIsCodeModalOpen(false);
            setCurrentEditingCode(null);
          }}
          onSave={handleCodeSave}
          initialData={currentEditingCode}
        />
      )}
    </div>
  );
}

export default ChatInterface;
