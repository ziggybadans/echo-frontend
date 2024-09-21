// src/utils/escapeHtml.js

export const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') {
      console.warn('escapeHtml received non-string:', unsafe);
      unsafe = String(unsafe);
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  