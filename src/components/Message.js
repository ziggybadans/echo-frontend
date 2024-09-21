import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardCopyIcon } from '@heroicons/react/solid';

function Message({ sender, text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
          sender === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
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