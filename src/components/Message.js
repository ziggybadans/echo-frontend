// src/components/Message.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MarkdownRenderer from './MarkdownRenderer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardCopyIcon } from '@heroicons/react/solid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a preferred theme from react-syntax-highlighter
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Message({ sender, text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-5xl p-5 rounded-xl ${
          sender === 'user'
            ? 'bg-zinc-950 text-white'
            : 'bg-gray-200 dark:bg-[#282828] text-gray-800 dark:text-gray-200'
        }`}
      >
        <MarkdownRenderer text={text} />
        <CopyToClipboard text={text} onCopy={handleCopy}>
          <button className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center">
            <ClipboardCopyIcon className="h-5 w-5 mr-1" /> {copied ? 'Copied!' : 'Copy'}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
}

export default Message;
