/**
 * Lightweight plain-text sanitizer for server and serverless environments.
 *
 * Strips all HTML/XML tags and decodes common HTML entities so the stored
 * value is safe to render as text content (React JSX escapes by default).
 *
 * Replaces isomorphic-dompurify which requires jsdom and breaks in
 * Vercel serverless functions.
 */

const HTML_TAG_RE = /<[^>]*>/g

const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&#x2F;': '/',
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
 * Sanitize HTML — currently strips all tags (plain-text only).
 * Kept for backward-compatibility with any callers using the old API.
 */
export function sanitizeHTML(html: string): string {
  return stripHtmlTags(html)
}
