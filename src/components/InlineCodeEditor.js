// src/components/InlineCodeEditor.js

import React, { useRef, useEffect, useCallback } from 'react';
import CodeAttachmentBubble from './CodeAttachmentBubble';
import { renderCodeBubble } from '../utils/renderCodeBubble';
import { escapeHtml } from '../utils/escapeHtml';

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
      // Pass the actual codeContent to renderCodeBubble
      return renderCodeBubble(fileName, notes, code);
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
        const codeContentEncoded = match.match(/data-codecontent="([^"]*)"/)?.[1];
        const codeContent = codeContentEncoded ? decodeURIComponent(codeContentEncoded) : '';
        return `<code fileName="${fileName}" notes="${notes}">${codeContent}</code>`;
      });
      onChange(plainText);
    }
  }, [onChange]);

  /**
   * Handles keydown events, specifically for inserting line breaks.
   *
   * @param {object} e - The event object.
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Insert a newline character
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode('\n'));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
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
      const codeContentEncoded = e.target.getAttribute('data-codecontent');
      const codeContent = codeContentEncoded ? decodeURIComponent(codeContentEncoded) : '';
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
