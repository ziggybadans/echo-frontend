// src/components/InlineCodeEditor.js

import React, { useRef, useEffect, useCallback } from 'react';
import CodeAttachmentBubble from './CodeAttachmentBubble';
import { renderCodeBubble } from '../utils/renderCodeBubble';
import { escapeHtml } from '../utils/escapeHtml';
import { unescapeHtml } from '../utils/unescapeHtml';

/**
 * Inline code editor component allowing users to input and attach code segments.
 *
 * @param {object} props - Component props.
 * @param {string} props.value - The current value of the editor.
 * @param {function} props.onChange - Function to call when the editor content changes.
 * @param {function} props.onAttachCode - Function to call when attaching code.
 * @returns {JSX.Element} The InlineCodeEditor component.
 */
function InlineCodeEditor({ value, onChange, onAttachCode }) {
  const editorRef = useRef(null);

  /**
   * Formats the content by replacing <code> tags with styled code bubbles.
   *
   * @param {string} content - The raw HTML content.
   * @returns {string} - The formatted HTML content.
   */
  const formatContent = useCallback((content) => {
    return content.replace(/<code([^>]*)>([\s\S]*?)<\/code>/g, (match, attributes, code) => {
      const fileName = attributes.match(/fileName="([^"]*)"/)?.[1] || 'Untitled';
      const notes = attributes.match(/notes="([^"]*)"/)?.[1] || '';
      // Use unescapeHtml to get actual code content
      const codeContent = unescapeHtml(code);
      return renderCodeBubble(fileName, notes, codeContent);
    });
  }, []);

  /**
   * Synchronizes the editor's HTML content with the internal state.
   */
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== formatContent(value)) {
      editorRef.current.innerHTML = formatContent(value);
    }
  }, [value, formatContent]);

  /**
   * Handles input events by decoding code bubbles and updating the state.
   */
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const plainText = content.replace(/<span class="code-bubble"[^>]*>[^<]*<\/span>/g, (match) => {
        const fileName = match.match(/data-filename="([^"]*)"/)?.[1];
        const notes = match.match(/data-notes="([^"]*)"/)?.[1];
        const codeContentEscaped = match.match(/data-codecontent="([^"]*)"/)?.[1];
        // Unescape the codeContent
        const codeContent = codeContentEscaped ? unescapeHtml(codeContentEscaped) : '';
        return `<code fileName="${fileName}" notes="${notes}">${codeContent}</code>`;
      });
      onChange(plainText);
    }
  }, [onChange]);

  /**
   * Handles keydown events, specifically for Enter and Shift+Enter.
   *
   * @param {object} e - The event object.
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow Shift+Enter to insert a newline
        // Let the event propagate naturally
      } else {
        // Prevent default behavior and emit a custom event or handle sending the message
        // Here, you might want to trigger the send action if needed
        // For InlineCodeEditor, we'll allow the parent to handle message sending
        // by not preventing default here
      }
    }
  }, []);

  /**
   * Handles paste events by stripping formatting and inserting plain text.
   *
   * @param {object} e - The event object.
   */
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  /**
   * Handles clicks on code bubbles to initiate editing.
   *
   * @param {object} e - The event object.
   */
  const handleBubbleClick = useCallback((e) => {
    if (e.target.classList.contains('code-bubble')) {
      const fileName = e.target.getAttribute('data-filename');
      const notes = e.target.getAttribute('data-notes');
      const codeContentEscaped = e.target.getAttribute('data-codecontent');
      const codeContent = codeContentEscaped ? unescapeHtml(codeContentEscaped) : '';
      onAttachCode({ fileName, notes, codeContent });
    }
  }, [onAttachCode]);

  return (
    <div className="relative border rounded-lg p-2 bg-white dark:bg-gray-800 text-black dark:text-white">
      <div
        ref={editorRef}
        className="min-h-[100px] max-h-[300px] overflow-y-auto p-2 focus:outline-none"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onClick={handleBubbleClick}
        role="textbox"
        aria-multiline="true"
        aria-label="Code Editor"
      />
    </div>
  );
}

export default InlineCodeEditor;
