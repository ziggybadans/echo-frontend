// src/utils/renderCodeBubble.js

import { escapeHtml } from './escapeHtml';

/**
 * Generates an HTML string for a code bubble with given details.
 *
 * @param {string} fileName - Name of the file.
 * @param {string} [notes=''] - Optional notes or annotations.
 * @param {string} [codeContent=''] - The code content to be associated.
 * @returns {string} - The HTML string representing the code bubble.
 */
export const renderCodeBubble = (fileName, notes = '', codeContent = '') => {
  // Safely escape all dynamic content to prevent XSS
  const safeFileName = escapeHtml(fileName || 'Untitled');
  const safeNotes = escapeHtml(notes);
  const safeCodeContent = escapeHtml(codeContent); // Changed from encodeURIComponent to escapeHtml

  return `
    <span
      class="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full mr-2 mb-2 code-bubble cursor-pointer"
      data-filename="${safeFileName}"
      data-notes="${safeNotes}"
      data-codecontent="${safeCodeContent}" <!-- Removed encoding -->
    >
      ${safeFileName}
    </span>
    \u200B <!-- Zero-width space to ensure cursor moves after the bubble -->
  `;
};
