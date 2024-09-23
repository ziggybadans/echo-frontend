// src/components/MarkdownRenderer.js

import React, { useContext, useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeContext } from '../context/CodeContext';
import { ExternalLinkIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/**
 * Component for rendering markdown content with syntax-highlighted code blocks.
 *
 * @param {object} props - Component props.
 * @param {string} props.text - The markdown text to render.
 * @returns {JSX.Element} The MarkdownRenderer component.
 */
const MarkdownRenderer = ({ text }) => {
  const { showCode } = useContext(CodeContext);
  const [copiedCode, setCopiedCode] = useState({}); // Track copied state per code block

  /**
   * Handles the copy action and updates the copied state.
   *
   * @param {number} key - Unique identifier for the code block.
   */
  const handleCopy = useCallback((key) => {
    setCopiedCode((prev) => ({ ...prev, [key]: true }));
  }, []);

  /**
   * Resets the copied state after a delay.
   */
  useEffect(() => {
    const timers = Object.keys(copiedCode).map((key) =>
      copiedCode[key] ? setTimeout(() => setCopiedCode((prev) => ({ ...prev, [key]: false })), 2000) : null
    );
    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [copiedCode]);

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (!inline && match) {
            const language = match[1];
            const codeContent = String(children).replace(/\n$/, '');
            const key = node.position?.start.line || Math.random().toString(36).substr(2, 9); // Unique key per block

            const onCopy = () => handleCopy(key);

            return (
              <div className="relative my-4">
                <SyntaxHighlighter
                  style={coldarkDark}
                  language={language}
                  PreTag="div"
                  className="rounded-lg"
                >
                  {codeContent}
                </SyntaxHighlighter>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <CopyToClipboard text={codeContent} onCopy={onCopy}>
                    <button
                      className="bg-gray-700 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75 flex items-center"
                      title="Copy Code"
                      aria-label="Copy Code"
                    >
                      <ClipboardCopyIcon className="h-4 w-4" />
                      {copiedCode[key] && <span className="ml-1 text-xs">Copied!</span>}
                    </button>
                  </CopyToClipboard>
                  <button
                    className="bg-gray-700 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75 flex items-center"
                    onClick={() =>
                      showCode({
                        codeContent: codeContent,
                        fileName: 'codeblock',
                        notes: '',
                      })
                    }
                    title="Pop Out Code"
                    aria-label="Pop Out Code"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        },
        h1: ({ node, ...props }) => <h1 className="text-2.5xl mb-4 mt-5" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl mb-2 mt-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-1.75xl mb-2 mt-3" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-1.5xl mb-2 mt-3" {...props} />,
        h5: ({ node, ...props }) => <h5 className="text-1.25xl mb-2" {...props} />,
        h6: ({ node, ...props }) => <h6 className="text-xl mb-2" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-6 border-gray-300 dark:border-gray-700" {...props} />,
        li: ({ node, ordered, ...props }) => <li className="ml-4 list-disc" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
