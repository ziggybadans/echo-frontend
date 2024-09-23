// src/components/ChatInterface.js
import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import CodeModal from "./CodeModal";
import InlineCodeEditor from "./InlineCodeEditor";
import { escapeHtml } from "../utils/escapeHtml";

function ChatInterface() {
  const {
    chats,
    currentChatId,
    addMessage,
    updateChat,
    selectedModelId,
    models,
  } = useContext(ChatContext);
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [currentEditingCode, setCurrentEditingCode] = useState(null);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  const addCodeAttachment = ({ codeContent, fileName, notes }) => {
    const escapedCode = escapeHtml(codeContent);
    const escapedFileName = escapeHtml(fileName || "untitled");
    const escapedNotes = escapeHtml(notes || "");
    const codeTag = `<code fileName="${escapedFileName}" notes="${escapedNotes}">${escapedCode}</code>`;
    setMessage((prev) => prev + codeTag);
  };

  const handleAttachCode = useCallback((codeSegment = null) => {
    setCurrentEditingCode(codeSegment);
    setIsCodeModalOpen(true);
  }, []);

  const handleCodeSave = (updatedCode) => {
    if (currentEditingCode) {
      // Update existing code
      const escapedCode = escapeHtml(updatedCode.codeContent);
      const escapedFileName = escapeHtml(updatedCode.fileName || "untitled");
      const escapedNotes = escapeHtml(updatedCode.notes || "");

      // Improved regex to handle multi-line and special characters
      const regex = new RegExp(
        `<code\\s+fileName="${currentEditingCode.fileName}"\\s+notes="${currentEditingCode.notes}">([\\s\\S]*?)<\\/code>`
      );

      const updatedMessage = message.replace(
        regex,
        `<code fileName="${escapedFileName}" notes="${escapedNotes}">${escapedCode}</code>`
      );
      setMessage(updatedMessage);
    } else {
      // Add new code
      addCodeAttachment(updatedCode);
    }
    setIsCodeModalOpen(false);
    setCurrentEditingCode(null);
  };

  const handleSend = useCallback(async () => {
    if (!message.trim() || !currentChatId || !selectedModelId) return;

    // Retrieve the system prompt from the current chat
    const systemPrompt = currentChat.systemPrompt || "";

    // Combine the system prompt with the user message
    // Ensure there's a separator (like a newline) for clarity
    const fullMessage = systemPrompt ? `${systemPrompt}\n${message}` : message;

    const userMessage = { sender: "user", text: message };
    addMessage(currentChatId, userMessage);
    setMessage("");
    scrollToBottom();

    // Set typing indicator
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullMessage,
          model_id: selectedModelId, // Ensure this is correctly set
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to get response from the server."
        );
      }

      const data = await response.json();
      const responseText = data.response;
      const responseModelId = data.model_id; // Extract model_id from response

      const botMessage = {
        sender: "bot",
        text: responseText,
        model_id: responseModelId, // Include model_id
      };
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
  });

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleEditorKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!currentChat) {
    return (
      <div className="flex-1 p-4">No active chat. Please start a new chat.</div>
    );
  }

  const handleSystemPromptChange = (e) => {
    const newPrompt = e.target.value;
    updateChat(currentChatId, { systemPrompt: newPrompt });
  };

  const toggleSystemPrompt = () => {
    setIsSystemPromptOpen(!isSystemPromptOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-32 pt-8 pb-8 overflow-y-auto bg-[#eeeeee] dark:bg-[#161618]">
        {/* Removed Model Selector Dropdown */}

        {/* Chat Messages */}
        {currentChat.messages.map((msg, index) => (
          <Message
            key={index}
            chatId={currentChatId}
            messageIndex={index}
            sender={msg.sender}
            text={msg.text}
            model_id={msg.model_id} // Pass model_id
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
        <div className="flex flex-row">
          <div className="flex-grow">
            <InlineCodeEditor
              value={message}
              onChange={setMessage}
              onAttachCode={handleAttachCode}
              onKeyDown={handleEditorKeyDown}
            />
          </div>
          <div className="flex flex-col items-end pl-4">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex-grow w-full"
            >
              Attach Code
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-grow mt-2 w-full"
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
