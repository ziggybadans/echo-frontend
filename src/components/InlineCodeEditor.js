// src/components/InlineCodeEditor.js
import React, { useRef, useEffect, useCallback } from 'react';
import CodeAttachmentBubble from './CodeAttachmentBubble';
import { renderCodeBubble } from '../utils/renderCodeBubble';

function InlineCodeEditor({ value, onChange, onAttachCode }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== formatContent(value)) {
      editorRef.current.innerHTML = formatContent(value);
    }
  }, [value]);

  const formatContent = (content) => {
    return content.replace(/<code([^>]*)>([\s\S]*?)<\/code>/g, (match, attributes, code) => {
      const fileName = attributes.match(/fileName="([^"]*)"/)?.[1] || 'Untitled';
      const notes = attributes.match(/notes="([^"]*)"/)?.[1] || '';
      // Pass the actual codeContent to renderCodeBubble
      return renderCodeBubble(fileName, notes, code);
    });
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const plainText = content.replace(/<span class="code-bubble"[^>]*>[^<]*<\/span>/g, (match) => {
        const fileName = match.match(/data-filename="([^"]*)"/)?.[1];
        const notes = match.match(/data-notes="([^"]*)"/)?.[1];
        const codeContentEscaped = match.match(/data-codecontent="([^"]*)"/)?.[1];
        // Unescape the codeContent
        const codeContent = codeContentEscaped ? decodeURIComponent(codeContentEscaped) : '';
        return `<code fileName="${fileName}" notes="${notes}">${codeContent}</code>`;
      });
      onChange(plainText);
    }
  }, [onChange]);

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

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleBubbleClick = useCallback((e) => {
    if (e.target.classList.contains('code-bubble')) {
      const fileName = e.target.getAttribute('data-filename');
      const notes = e.target.getAttribute('data-notes');
      const codeContentEscaped = e.target.getAttribute('data-codecontent');
      const codeContent = codeContentEscaped ? decodeURIComponent(codeContentEscaped) : '';
      onAttachCode({ fileName, notes, codeContent });
    }
  }, [onAttachCode]);

  return (
    <div className="relative border rounded-lg p-2 bg-white dark:bg-[#18181b] text-black dark:text-white">
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
