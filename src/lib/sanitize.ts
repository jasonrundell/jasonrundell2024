/**
 * Safe HTML sanitization utility for server and client environments.
 * Uses isomorphic-dompurify for robust, standards-compliant sanitization.
 */

if (typeof process !== 'undefined') {
  if (!process.env.JSDOM_CSS) {
    process.env.JSDOM_CSS = 'false'
  }
  if (!process.env.JSDOM_RESOURCE_LOADER) {
    process.env.JSDOM_RESOURCE_LOADER = 'false'
  }
}

import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}
