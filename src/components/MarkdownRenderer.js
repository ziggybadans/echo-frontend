import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ text }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={coldarkDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        h1: ({ node, ...props }) => <h1 style={{ fontSize: '2.5em', marginBottom: '1em', marginTop: '1.25em' }} {...props} />,
        h2: ({ node, ...props }) => <h2 style={{ fontSize: '2em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.75em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h4: ({ node, ...props }) => <h4 style={{ fontSize: '1.5em', marginBottom: '0.5em', marginTop: '0.75em' }} {...props} />,
        h5: ({ node, ...props }) => <h5 style={{ fontSize: '1.25em', marginBottom: '0.5em' }} {...props} />,
        h6: ({ node, ...props }) => <h6 style={{ fontSize: '1.1em', marginBottom: '0.5em' }} {...props} />,
        hr: ({ node, ...props }) => <hr style={{ marginTop: '1.5em', marginBottom: '1em' }} {...props} />,
        li: ({ node, ...props }) => <li style={{ marginLeft: '0.5em' }} {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;