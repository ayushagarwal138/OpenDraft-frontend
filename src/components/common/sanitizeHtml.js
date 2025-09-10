// This utility sanitizes HTML content on the frontend using DOMPurify.
// Usage: import and use sanitizeHtml(html) before rendering or passing to TipTap.
import DOMPurify from 'dompurify';

const TABLE_TAGS = [
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'col', 'colgroup'
];

function isValidHTML(html) {
  try {
    const doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = html;
    // If the browser parsed it and body has children, it's valid enough for TipTap
    return doc.body.children.length > 0;
  } catch (e) {
    return false;
  }
}

export default function sanitizeHtml(html) {
  // Remove all table-related tags
  let cleaned = html.replace(/<\/?(?:" + TABLE_TAGS.join('|') + ")[^>]*>/gi, '');
  // DOMPurify for everything else
  let safe = DOMPurify.sanitize(cleaned, {
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
  // Final strict check: if not valid HTML, replace with fallback and log
  if (!isValidHTML(safe)) {
    // eslint-disable-next-line no-console
    console.warn('sanitizeHtml: Invalid HTML detected and replaced:', html);
    return '<p></p>';
  }
  return safe;
}
