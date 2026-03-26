/**
 * HTML utilities for server-side use.
 *
 * - stripHtmlTags: removes all tags and decodes common entities (plain text).
 *   Use for APIs and anywhere markup must not appear.
 * - sanitizeHTML: DOMPurify default allowlist; use with dangerouslySetInnerHTML
 *   when safe markup (e.g. Contentful code marks: b, i, a) must be preserved.
 *
 * Load dompurify-config before isomorphic-dompurify so Node/jsdom skips
 * default-stylesheet.css in Next.js server environments.
 */
import './dompurify-config'
import DOMPurify from 'isomorphic-dompurify'

const HTML_TAG_RE = /<[^>]*>/g

const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&#x2f;': '/',
  '&#47;': '/',
}
const ENTITY_RE = new RegExp(Object.keys(ENTITY_MAP).join('|'), 'gi')

/**
 * Strip every HTML/XML tag from the input and decode common HTML entities.
 * Equivalent to `DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })`.
 */
export function stripHtmlTags(input: string): string {
  const stripped = input.replace(HTML_TAG_RE, '')
  return stripped.replace(ENTITY_RE, (match) => ENTITY_MAP[match.toLowerCase()] ?? match)
}

/**
 * Sanitize HTML for injection into the DOM: safe tags/attributes kept,
 * dangerous content removed (same behavior as DOMPurify.sanitize with default config).
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}
