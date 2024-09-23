// src/utils/escapeHtml.js

/**
 * Escapes HTML special characters in a string to prevent XSS attacks.
 *
 * @param {string} unsafe - The string to be escaped.
 * @returns {string} - The escaped string safe for insertion into HTML.
 */
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') {
    console.warn('escapeHtml received non-string:', unsafe);
    unsafe = String(unsafe);
  }

  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return unsafe.replace(/[&<>"'`=\/]/g, (char) => entityMap[char]);
};
