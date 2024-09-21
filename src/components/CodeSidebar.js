// src/components/CodeSidebar.js
import React, { useContext, useState } from 'react';
import { CodeContext } from '../context/CodeContext';
import { XIcon, ClipboardCopyIcon } from '@heroicons/react/solid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function CodeSidebar() {
  const { isSidebarOpen, currentCode, hideCode } = useContext(CodeContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isSidebarOpen || !currentCode) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-1/3 bg-gray-100 dark:bg-gray-800 shadow-lg z-50 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {currentCode.fileName}
        </h2>
        <button onClick={hideCode}>
          <XIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white" />
        </button>
      </div>
      <div className="p-4">
        <div className="relative">
          <SyntaxHighlighter
            style={coldarkDark}
            language={currentCode.language || 'javascript'} // Optionally pass language
            PreTag="div"
          >
            {currentCode.codeContent}
          </SyntaxHighlighter>
          <CopyToClipboard text={currentCode.codeContent} onCopy={handleCopy}>
            <button
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75 flex items-center"
              title="Copy Code"
            >
              <ClipboardCopyIcon className="h-4 w-4" />
              {copied && <span className="ml-1 text-xs">Copied!</span>}
            </button>
          </CopyToClipboard>
        </div>
        {currentCode.notes && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Notes:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentCode.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeSidebar;
