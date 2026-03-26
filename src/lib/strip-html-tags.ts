/**
 * Plain-text HTML stripping for APIs and server routes.
 *
 * No DOMPurify/jsdom — safe to import from serverless handlers that must stay
 * lightweight. For safe markup with `dangerouslySetInnerHTML`, use
 * `sanitizeHTML` from `@/lib/sanitize`.
 */

/** Tag-like sequences only (not bare `<` / `>`); allows whitespace around `/`. */
const HTML_TAG_RE = /<\s*\/?\s*[A-Za-z][^>]*>/g

/** Paired script/style: remove element and inner content (DOMPurify does not KEEP_CONTENT for these). */
const SCRIPT_BLOCK_RE = /<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi
const STYLE_BLOCK_RE = /<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi
/** Unclosed opening script/style: drop the rest of the string (matches browser/DOMPurify recovery). */
const SCRIPT_TAIL_RE = /<\s*script\b[^>]*>[\s\S]*/gi
const STYLE_TAIL_RE = /<\s*style\b[^>]*>[\s\S]*/gi

function removeScriptAndStyleBlocks(s: string): string {
  let out = s
  let prev = ''
  while (out !== prev) {
    prev = out
    out = out
      .replace(SCRIPT_BLOCK_RE, '')
      .replace(STYLE_BLOCK_RE, '')
  }
  return out.replace(SCRIPT_TAIL_RE, '').replace(STYLE_TAIL_RE, '')
}

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

/** Valid for `String.fromCodePoint`: in range and not a lone surrogate (U+D800–U+DFFF). */
function isUnicodeScalarValue(code: number): boolean {
  return (
    Number.isFinite(code) &&
    code >= 0 &&
    code <= 0x10ffff &&
    (code < 0xd800 || code > 0xdfff)
  )
}

/**
 * Decode HTML entities (named + numeric) until stable so double-encoded
 * payloads like `&amp;lt;` cannot become tags after tag stripping.
 */
function decodeHtmlEntitiesOnce(s: string): string {
  let out = s.replace(ENTITY_RE, (match) => ENTITY_MAP[match.toLowerCase()] ?? match)
  out = out.replace(NUMERIC_DEC_RE, (full, digits: string) => {
    const code = Number.parseInt(digits, 10)
    if (!isUnicodeScalarValue(code)) {
      return full
    }
    return String.fromCodePoint(code)
  })
  out = out.replace(NUMERIC_HEX_RE, (full, hex: string) => {
    const code = Number.parseInt(hex, 16)
    if (!isUnicodeScalarValue(code)) {
      return full
    }
    return String.fromCodePoint(code)
  })
  return out
}

/**
 * Strip every HTML/XML tag from the input and decode common HTML entities.
 * Matches `DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })` for script/style:
 * those elements and their inner content are removed, not only the tags.
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
    s = removeScriptAndStyleBlocks(decoded).replace(HTML_TAG_RE, '')
  }
  return s
}
