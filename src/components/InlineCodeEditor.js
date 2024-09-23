// src/components/InlineCodeEditor.js
import React, { useRef, useEffect } from 'react';
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

  const handleInput = () => {
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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleBubbleClick = (e) => {
    if (e.target.classList.contains('code-bubble')) {
      const fileName = e.target.getAttribute('data-filename');
      const notes = e.target.getAttribute('data-notes');
      const codeContentEncoded = e.target.getAttribute('data-codecontent');
      const codeContent = codeContentEncoded ? decodeURIComponent(codeContentEncoded) : '';
      onAttachCode({ fileName, notes, codeContent });
    }
  };

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
        // Remove value prop to make it uncontrolled
      />
    </div>
  );
}

export default InlineCodeEditor;
