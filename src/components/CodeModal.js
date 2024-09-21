import React from 'react';
import { Dialog } from '@headlessui/react';
import { ClipboardCopyIcon, XIcon } from '@heroicons/react/solid';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function CodeModal({ code, setIsCodeModalOpen }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={true}
      onClose={() => setIsCodeModalOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl mx-auto p-6 z-20">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Code Snippet
            </Dialog.Title>
            <button onClick={() => setIsCodeModalOpen(false)}>
              <XIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
            </button>
          </div>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
            <code>{code}</code>
          </pre>
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
              <ClipboardCopyIcon className="h-5 w-5 mr-1" /> {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </Dialog>
  );
}

export default CodeModal;