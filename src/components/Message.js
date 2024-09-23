// src/components/Message.js
import React, { useState, useContext } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardCopyIcon } from '@heroicons/react/solid';
import { CodeContext } from '../context/CodeContext';
import CodeAttachmentBubble from './CodeAttachmentBubble';
import CodeModal from './CodeModal';
import { ChatContext } from '../context/ChatContext';

function Message({ chatId, messageIndex, sender, text }) {
  const [copied, setCopied] = useState(false);
  const { showCode } = useContext(CodeContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);
  const { updateMessage } = useContext(ChatContext); // Ensure ChatContext is imported

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeText = String(text);

  // Function to extract code attachments
  const extractCodeAttachments = (text) => {
    const codeRegex = /<code(?:\s+fileName="([^"]*)")?(?:\s+notes="([^"]*)")?>([\s\S]*?)<\/code>/g;
    let match;
    const attachments = [];
    while ((match = codeRegex.exec(text)) !== null) {
      attachments.push({
        fileName: match[1] || 'Untitled',
        notes: match[2] || '',
        codeContent: match[3],
      });
    }
    return attachments;
  };

  const codeAttachments = extractCodeAttachments(safeText);
  const cleanedText = safeText.replace(/<code(?:\s+fileName="[^"]*")?(?:\s+notes="[^"]*")?>[\s\S]*?<\/code>/g, '');

  // Handlers for editing and deleting attachments
  const handleEdit = (attachment) => {
    setCurrentAttachment(attachment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (attachment) => {
    // Implement deletion logic
    // For example, remove the attachment's <code> block from the message text
    const updatedText = text.replace(
      `<code fileName="${attachment.fileName}" notes="${attachment.notes}">${attachment.codeContent}</code>`,
      ''
    );
    updateMessage(chatId, messageIndex, { text: updatedText });
  };

  const handleUpdateAttachment = (updatedAttachment) => {
    // Replace the old <code> block with the updated one
    const oldCodeBlockRegex = new RegExp(
      `<code(?:\\s+fileName="${updatedAttachment.fileName || 'Untitled'}")?(?:\\s+notes="${updatedAttachment.notes || ''}")?>[\\s\\S]*?<\\/code>`,
      'g'
    );
    const newCodeBlock = `<code fileName="${updatedAttachment.fileName}" notes="${updatedAttachment.notes}">${updatedAttachment.codeContent}</code>`;
    const updatedText = text.replace(oldCodeBlockRegex, newCodeBlock);
    updateMessage(chatId, messageIndex, { text: updatedText });
  };

  return (
    <>
      <div className={`mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xs md:max-w-md lg:max-w-5xl p-5 rounded-xl ${
            sender === 'user'
              ? 'bg-zinc-950 text-white'
              : 'bg-gray-200 dark:bg-[#282828] text-gray-800 dark:text-gray-200'
          }`}
        >
          <MarkdownRenderer text={cleanedText} />
          <div className="mt-2 flex flex-wrap">
            {codeAttachments.map((attachment, index) => (
              <CodeAttachmentBubble
                key={index}
                attachment={attachment}
                onEdit={() => handleEdit(attachment)}
                onDelete={() => handleDelete(attachment)}
              />
            ))}
          </div>
          <CopyToClipboard text={text} onCopy={handleCopy}>
            <button className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center">
              <ClipboardCopyIcon className="h-5 w-5 mr-1" /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
      {isEditModalOpen && currentAttachment && (
        <CodeModal
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateAttachment}
          initialData={currentAttachment}
        />
      )}
    </>
  );
}

export default Message;