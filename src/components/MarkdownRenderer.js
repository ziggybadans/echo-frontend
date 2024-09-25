import React, { useContext, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeContext } from '../context/CodeContext';
import { ExternalLinkIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../styles/MarkdownRenderer.css'

const MarkdownRenderer = ({ text }) => {
  const { showCode } = useContext(CodeContext);
  const [copiedCode, setCopiedCode] = useState({}); // Track copied state per code block

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (!inline && match) {
            const language = match[1];
            const codeContent = String(children).replace(/\n$/, '');
            const key = node.position.start.line; // Unique key per block based on line number

            const handleCopy = () => {
              setCopiedCode((prev) => ({ ...prev, [key]: true }));
              setTimeout(() => {
                setCopiedCode((prev) => ({ ...prev, [key]: false }));
              }, 2000);
            };

            return (
              <div className="relative my-4">
                <SyntaxHighlighter style={coldarkDark} language={language} PreTag="div" {...props}>
                  {codeContent}
                </SyntaxHighlighter>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <CopyToClipboard text={codeContent} onCopy={handleCopy}>
                    <button
                      className="bg-gray-700 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75 flex items-center"
                      title="Copy Code"
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
        h1: ({ node, ...props }) => <h1 style={{ fontSize: '2.5em', marginBottom: '1em', marginTop: '1.25em' }} {...props} />,
        h2: ({ node, ...props }) => <h2 style={{ fontSize: '2em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.75em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h4: ({ node, ...props }) => <h4 style={{ fontSize: '1.5em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h5: ({ node, ...props }) => <h5 style={{ fontSize: '1.25em', marginBottom: '0.5em' }} {...props} />,
        h6: ({ node, ...props }) => <h6 style={{ fontSize: '1.1em', marginBottom: '0.5em' }} {...props} />,
        hr: ({ node, ...props }) => <hr style={{ marginTop: '1.5em', marginBottom: '1em' }} {...props} />,
        li: ({ node, ...props }) => <li className='p' style={{ marginLeft: '0.5em' }} {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;