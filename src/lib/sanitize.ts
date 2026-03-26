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

/** Tag-like sequences only (not bare `<` / `>`); allows whitespace around `/`. */
const HTML_TAG_RE = /<\s*\/?\s*[A-Za-z][^>]*>/g

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

const NUMERIC_DEC_RE = /&#(\d+);/g
const NUMERIC_HEX_RE = /&#x([0-9a-f]+);/gi

/**
 * Decode HTML entities (named + numeric) until stable so double-encoded
 * payloads like `&amp;lt;` cannot become tags after tag stripping.
 */
function decodeHtmlEntitiesOnce(s: string): string {
  let out = s.replace(ENTITY_RE, (match) => ENTITY_MAP[match.toLowerCase()] ?? match)
  out = out.replace(NUMERIC_DEC_RE, (full, digits: string) => {
    const code = Number.parseInt(digits, 10)
    if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) {
      return full
    }
    try {
      return String.fromCodePoint(code)
    } catch {
      return full
    }
  })
  out = out.replace(NUMERIC_HEX_RE, (full, hex: string) => {
    const code = Number.parseInt(hex, 16)
    if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) {
      return full
    }
    try {
      return String.fromCodePoint(code)
    } catch {
      return full
    }
  })
  return out
}

/**
 * Strip every HTML/XML tag from the input and decode common HTML entities.
 * Equivalent to `DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })`.
 *
 * Decodes entities (iteratively) before stripping tags each round so entity-
 * encoded markup cannot survive as active tags after decode.
 */
export function stripHtmlTags(input: string): string {
  let s = input
  let prev = ''
  while (s !== prev) {
    prev = s
    let decoded = s
    let dprev = ''
    while (decoded !== dprev) {
      dprev = decoded
      decoded = decodeHtmlEntitiesOnce(decoded)
    }
    s = decoded.replace(HTML_TAG_RE, '')
  }
  return s
}

/**
 * Sanitize HTML for injection into the DOM: safe tags/attributes kept,
 * dangerous content removed (same behavior as DOMPurify.sanitize with default config).
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html)
}
