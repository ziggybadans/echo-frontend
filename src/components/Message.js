// src/components/Message.js

import React, { useState, useContext, useCallback } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { CodeContext } from "../context/CodeContext";
import CodeAttachmentBubble from "./CodeAttachmentBubble";
import CodeModal from "./CodeModal";
import { ChatContext } from "../context/ChatContext";

/**
 * Component representing a single chat message.
 *
 * @param {object} props - Component props.
 * @param {string} props.chatId - The ID of the chat.
 * @param {number} props.messageIndex - The index of the message within the chat.
 * @param {string} props.sender - The sender of the message ('user' or 'bot').
 * @param {string} props.text - The message text.
 * @param {string|null} props.model_id - The ID of the model used for bot responses.
 * @returns {JSX.Element} The Message component.
 */
function Message({ chatId, messageIndex, sender, text, model_id }) {
  const [copied, setCopied] = useState(false);
  const { showCode } = useContext(CodeContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);
  const { updateMessage, models } = useContext(ChatContext);

  const modelName = model_id
    ? models.find((model) => model.id === model_id)?.name || "Unknown Model"
    : null;

  /**
   * Handles the copy action and updates the copied state.
   */
  const handleCopy = useCallback(() => {
    setCopied(true);
  }, []);

  /**
   * Resets the copied state after a delay.
   */
  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  /**
   * Extracts code attachments from the message text.
   *
   * @param {string} text - The message text.
   * @returns {Array} An array of code attachment objects.
   */
  const extractCodeAttachments = useCallback((text) => {
    const codeRegex =
      /<code(?:\s+fileName="([^"]*)")?(?:\s+notes="([^"]*)")?>([\s\S]*?)<\/code>/g;
    let match;
    const attachments = [];
    while ((match = codeRegex.exec(text)) !== null) {
      attachments.push({
        fileName: match[1] || "Untitled",
        notes: match[2] || "",
        codeContent: match[3],
      });
    }
    return attachments;
  }, []);

  const codeAttachments = extractCodeAttachments(text);
  const cleanedText = text.replace(
    /<code(?:\s+fileName="[^"]*")?(?:\s+notes="[^"]*")?>[\s\S]*?<\/code>/g,
    ""
  );

  /**
   * Initiates editing of a code attachment.
   *
   * @param {object} attachment - The code attachment to edit.
   */
  const handleEdit = useCallback((attachment) => {
    setCurrentAttachment(attachment);
    setIsEditModalOpen(true);
  }, []);

  /**
   * Deletes a code attachment from the message.
   *
   * @param {object} attachment - The code attachment to delete.
   */
  const handleDelete = useCallback(
    (attachment) => {
      const updatedText = text.replace(
        `<code fileName="${attachment.fileName}" notes="${attachment.notes}">${attachment.codeContent}</code>`,
        ""
      );
      updateMessage(chatId, messageIndex, { text: updatedText });
    },
    [text, updateMessage, chatId, messageIndex]
  );

  /**
   * Updates a code attachment after editing.
   *
   * @param {object} updatedAttachment - The updated code attachment data.
   */
  const handleUpdateAttachment = useCallback(
    (updatedAttachment) => {
      const oldCodeBlockRegex = new RegExp(
        `<code\\s+fileName="${
          updatedAttachment.fileName || "Untitled"
        }"\\s+notes="${updatedAttachment.notes || ""}">[\\s\\S]*?<\\/code>`,
        "g"
      );
      const newCodeBlock = `<code fileName="${updatedAttachment.fileName}" notes="${updatedAttachment.notes}">${updatedAttachment.codeContent}</code>`;
      const updatedText = text.replace(oldCodeBlockRegex, newCodeBlock);
      updateMessage(chatId, messageIndex, { text: updatedText });
    },
    [text, updateMessage, chatId, messageIndex]
  );

  return (
    <>
      <div
        className={`mb-4 flex ${
          sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md lg:max-w-5xl p-5 rounded-xl ${
            sender === "user"
              ? "bg-zinc-950 text-white"
              : "bg-gray-200 dark:bg-[#282828] text-gray-800 dark:text-gray-200"
          }`}
          role={sender === "user" ? "article" : "document"}
          aria-label={`${sender === "user" ? "User" : "Bot"} message`}
        >
          {sender === "bot" && modelName && (
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <strong>Model:</strong> {modelName}
            </div>
          )}

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
            <button
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center"
              aria-label="Copy Message"
            >
              <ClipboardCopyIcon className="h-5 w-5 mr-1" />{" "}
              {copied ? "Copied!" : "Copy"}
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
