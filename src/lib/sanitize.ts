/**
 * HTML sanitization for server-side use with `dangerouslySetInnerHTML`.
 *
 * - sanitizeHTML: DOMPurify default allowlist; use when safe markup (e.g.
 *   Contentful code marks: b, i, a) must be preserved.
 *
 * For plain text / API bodies without markup, import `stripHtmlTags` from
 * `@/lib/strip-html-tags` so serverless routes do not load jsdom.
 *
 * Load dompurify-config before isomorphic-dompurify so Node/jsdom skips
 * default-stylesheet.css in Next.js server environments.
 */
import './dompurify-config'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML for injection into the DOM: safe tags/attributes kept,
 * dangerous content removed (same behavior as DOMPurify.sanitize with default config).
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}
