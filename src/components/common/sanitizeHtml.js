// This utility sanitizes HTML content on the frontend using DOMPurify.
// Usage: import and use sanitizeHtml(html) before rendering or passing to TipTap.
import DOMPurify from 'dompurify';

export default function sanitizeHtml(html) {
  // Configure DOMPurify for stricter table handling if needed
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel', 'colspan', 'rowspan', 'width', 'height'
    ],
    // You can add more strictness here if needed
  });
}
