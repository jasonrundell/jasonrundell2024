/**
 * Safe HTML sanitization utility for server and client environments.
 * Uses isomorphic-dompurify for robust, standards-compliant sanitization.
 *
 * The jsdom default-stylesheet.css issue is handled by webpack plugins
 * in next.config.mjs that emit an empty CSS file to the output directory
 * and replace the require() call with an empty module.
 */

import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}
