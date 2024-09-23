// src/components/InlineCodeEditor.js
import React, { useRef, useEffect } from 'react';
import CodeAttachmentBubble from './CodeAttachmentBubble';

function InlineCodeEditor({ value, onChange, onAttachCode }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== formatContent(value)) {
      editorRef.current.innerHTML = formatContent(value);
    }
  }, [value]);

  const formatContent = (content) => {
    return content.replace(/<code([^>]*)>([^<]*)<\/code>/g, (match, attributes, code) => {
      const fileName = attributes.match(/fileName="([^"]*)"/)?.[1] || 'Untitled';
      const notes = attributes.match(/notes="([^"]*)"/)?.[1] || '';
      return `<span class="code-bubble" data-filename="${fileName}" data-notes="${notes}">${fileName}</span>`;
    });
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const plainText = content.replace(/<span class="code-bubble"[^>]*>[^<]*<\/span>/g, (match) => {
        const fileName = match.match(/data-filename="([^"]*)"/)[1];
        const notes = match.match(/data-notes="([^"]*)"/)[1];
        return `<code fileName="${fileName}" notes="${notes}"></code>`;
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
      onAttachCode({ fileName, notes, content: '' });
    }
  };

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
        // Remove value prop to make it uncontrolled
      />
      <style jsx>{`
        .code-bubble {
          display: inline-block;
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 2px 6px;
          border-radius: 4px;
          margin: 0 2px;
          font-size: 0.9em;
          cursor: pointer;
        }
        .code-bubble:hover {
          background-color: #bae6fd;
        }
      `}</style>
    </div>
  );
}

export default InlineCodeEditor;
