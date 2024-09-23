// src/components/CodeModal.js

import React, { useState, useEffect, useCallback } from 'react';

/**
 * Modal component for attaching or editing code segments.
 *
 * @param {object} props - Component props.
 * @param {function} props.onClose - Function to call when closing the modal.
 * @param {function} props.onSave - Function to call when saving the attachment.
 * @param {object|null} props.initialData - Initial data for editing, if any.
 * @returns {JSX.Element|null} The CodeModal component or null if not visible.
 */
function CodeModal({ onClose, onSave, initialData = null }) {
  const [codeContent, setCodeContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCodeContent(initialData.codeContent);
      setFileName(initialData.fileName);
      setNotes(initialData.notes);
    }
  }, [initialData]);

  /**
   * Handles the save action by validating inputs and invoking the onSave callback.
   */
  const handleSave = useCallback(() => {
    if (codeContent.trim() === '') {
      setError('Code content cannot be empty.');
      return;
    }
    setError('');
    onSave({ codeContent, fileName, notes });
    onClose();
  }, [codeContent, fileName, notes, onSave, onClose]);

  /**
   * Handles the key press event for accessibility (e.g., closing on Esc).
   *
   * @param {object} e - The event object.
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 id="code-modal-title" className="text-xl mb-4 text-gray-800 dark:text-gray-200">
          {initialData ? 'Edit Code Attachment' : 'Attach Code'}
        </h2>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <textarea
          className="w-full p-2 border rounded-lg resize-none dark:bg-gray-700 dark:text-white mb-2"
          rows="6"
          placeholder="Enter your code here..."
          value={codeContent}
          onChange={(e) => setCodeContent(e.target.value)}
          aria-label="Code Content"
        />
        <input
          type="text"
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white mb-2"
          placeholder="File Name (optional)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          aria-label="File Name"
        />
        <textarea
          className="w-full p-2 border rounded-lg resize-none dark:bg-gray-700 dark:text-white mb-2"
          rows="3"
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Notes"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none"
            aria-label="Cancel Attachment"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            aria-label={initialData ? "Update Attachment" : "Attach Code"}
          >
            {initialData ? 'Update' : 'Attach'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeModal;
