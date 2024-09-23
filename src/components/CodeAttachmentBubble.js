// src/components/CodeAttachmentBubble.js
import React from 'react';
import { EyeIcon, TrashIcon } from '@heroicons/react/solid';

function CodeAttachmentBubble({ attachment, onEdit, onDelete }) {
  return (
    <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full mr-2 mb-2">
      <span className="mr-2 text-xs md:text-sm truncate" title={attachment.fileName}>
        {attachment.fileName || 'Untitled'}
      </span>
      <button
        onClick={onEdit}
        className="hover:text-blue-600 dark:hover:text-blue-500 focus:outline-none"
        title="View Attachment"
        aria-label="View Attachment"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default CodeAttachmentBubble;
