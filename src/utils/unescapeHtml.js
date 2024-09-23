// src/utils/unescapeHtml.js

/**
 * Reverses the escaping of HTML characters.
 *
 * @param {string} unsafe - The escaped HTML string.
 * @returns {string} - The unescaped HTML string.
 */
export const unescapeHtml = (unsafe) => {
    const doc = new DOMParser().parseFromString(unsafe, "text/html");
    return doc.documentElement.textContent;
  };
  