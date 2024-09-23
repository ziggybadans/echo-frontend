// src/utils/renderCodeBubble.js
export const renderCodeBubble = (fileName, notes, codeContent) => {
    // Encode the codeContent to safely include it in a data attribute
    const encodedCodeContent = encodeURIComponent(codeContent || '');
    
    return `
      <span
        class="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full mr-2 mb-2 code-bubble cursor-pointer"
        data-filename="${fileName || 'Untitled'}"
        data-notes="${notes || ''}"
        data-codecontent="${encodedCodeContent}"
      >
        ${fileName || 'Untitled'}
      </span>
      \u200B
    `;
  };
  