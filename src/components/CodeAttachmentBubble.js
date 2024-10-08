// src/components/CodeAttachmentBubble.js

import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

/**
 * Component representing a code attachment bubble with edit and delete options.
 *
 * @param {object} props - Component props.
 * @param {object} props.attachment - The code attachment details.
 * @param {function} props.onEdit - Function to call when editing the attachment.
 * @param {function} props.onDelete - Function to call when deleting the attachment.
 * @returns {JSX.Element} The CodeAttachmentBubble component.
 */
function CodeAttachmentBubble({ attachment, onEdit, onDelete }) {
  return (
    <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full mr-2 mb-2">
      <span
        className="mr-2 text-xs md:text-sm truncate"
        title={attachment.fileName || 'Untitled'}
      >
        {attachment.fileName || 'Untitled'}
      </span>
      <button
        onClick={onEdit}
        className="hover:text-blue-600 dark:hover:text-blue-500 focus:outline-none"
        title="Edit Attachment"
        aria-label="Edit Attachment"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="ml-1 hover:text-red-600 dark:hover:text-red-500 focus:outline-none"
        title="Delete Attachment"
        aria-label="Delete Attachment"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default CodeAttachmentBubble;
