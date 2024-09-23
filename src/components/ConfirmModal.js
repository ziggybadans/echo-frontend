// src/components/ConfirmModal.js

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Modal component for confirming critical actions like deleting all chats.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.message - The message prompting the user.
 * @param {function} props.onConfirm - Function to call upon confirmation.
 * @param {function} props.onCancel - Function to call to cancel the action.
 * @returns {JSX.Element} The ConfirmModal component.
 */
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  const modalRef = useRef(null);

  /**
   * Handles keydown events for accessibility (e.g., closing on Esc).
   *
   * @param {object} e - The event object.
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Traps focus within the modal when it's open.
   *
   * @param {object} e - The focus event object.
   */
  const handleFocus = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      e.stopPropagation();
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('focus', handleFocus, true);
    return () => {
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [handleFocus]);

  useEffect(() => {
    const currentModal = modalRef.current;
    currentModal.focus();
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3"
        ref={modalRef}
        tabIndex="-1"
      >
        <h3 id="confirm-modal-title" className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {message}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none"
            aria-label="Cancel Deletion"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            aria-label="Confirm Deletion"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
