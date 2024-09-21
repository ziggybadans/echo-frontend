// src/components/CodeModal.js

import React, { useState, useEffect } from 'react';

function CodeModal({ onClose, onSave, initialData }) {
  const [codeContent, setCodeContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setCodeContent(initialData.codeContent);
      setFileName(initialData.fileName);
      setNotes(initialData.notes);
    }
  }, [initialData]);

  const handleSave = () => {
    if (codeContent.trim() === '') {
      alert('Code content cannot be empty.');
      return;
    }
    // **Do not apply escapeHtml here** to prevent double-escaping
    onSave({ codeContent, fileName, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl mb-4">{initialData ? 'Edit Code Attachment' : 'Attach Code'}</h2>
        <textarea
          className="w-full p-2 border rounded-lg resize-none dark:bg-gray-700 dark:text-white mb-2"
          rows="6"
          placeholder="Enter your code here..."
          value={codeContent}
          onChange={(e) => setCodeContent(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white mb-2"
          placeholder="File Name (optional)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded-lg resize-none dark:bg-gray-700 dark:text-white mb-2"
          rows="3"
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {initialData ? 'Update' : 'Attach'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeModal;
