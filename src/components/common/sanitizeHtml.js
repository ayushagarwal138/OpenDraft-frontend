// This utility sanitizes HTML content on the frontend using DOMPurify.
// Usage: import and use sanitizeHtml(html) before rendering or passing to TipTap.
import DOMPurify from 'dompurify';

// Remove all table-related tags as a failsafe
const TABLE_TAGS = [
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'col', 'colgroup'
];

export default function sanitizeHtml(html) {
  // Remove all table-related tags and their content
  let cleaned = html.replace(/<\/?(?:" + TABLE_TAGS.join('|') + ")[^>]*>/gi, '');
  // DOMPurify for everything else
  return DOMPurify.sanitize(cleaned, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'img', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel', 'colspan', 'rowspan', 'width', 'height'
    ],
  });
}
