/**
 * Plain-text HTML stripping for APIs and server routes.
 *
 * No DOMPurify/jsdom — safe to import from serverless handlers that must stay
 * lightweight. For safe markup with `dangerouslySetInnerHTML`, use
 * `sanitizeHTML` from `@/lib/sanitize`.
 */

/**
 * Index after `>` for a tag starting at `lt` (`<`), or -1 if not a tag-like
 * sequence (`<` + optional `/` + name starting with a letter). Respects `"` and
 * `'` so `>` inside quoted attributes does not end the tag.
 */
function findOpeningTagEnd(s: string, lt: number): number {
  const n = s.length
  let i = lt + 1
  while (i < n && /\s/.test(s[i])) i++
  if (i < n && s[i] === '/') i++
  while (i < n && /\s/.test(s[i])) i++
  if (i >= n || !/[A-Za-z]/.test(s[i])) return -1
  i++
  while (i < n && /[A-Za-z0-9-]/.test(s[i])) i++
  while (i < n) {
    const c = s[i]
    if (c === '>') return i + 1
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < n && s[i] !== q) i++
      if (i < n) i++
      continue
    }
    i++
  }
  return -1
}

function removeGenericHtmlTags(s: string): string {
  const parts: string[] = []
  let pos = 0
  while (pos < s.length) {
    const lt = s.indexOf('<', pos)
    if (lt === -1) {
      parts.push(s.slice(pos))
      break
    }
    parts.push(s.slice(pos, lt))
    const end = findOpeningTagEnd(s, lt)
    if (end === -1) {
      parts.push('<')
      pos = lt + 1
    } else {
      pos = end
    }
  }
  return parts.join('')
}

const SCRIPT_NAME = 'script' as const
const STYLE_NAME = 'style' as const

/** Opening `<script` / `<style` only; returns index after `>`, or -1. */
function findSpecialElementOpenEnd(
  s: string,
  lt: number,
  tag: typeof SCRIPT_NAME | typeof STYLE_NAME
): number {
  const n = s.length
  let i = lt + 1
  while (i < n && /\s/.test(s[i])) i++
  if (i < n && s[i] === '/') return -1
  const frag = s.slice(i, i + tag.length).toLowerCase()
  if (frag !== tag) return -1
  i += tag.length
  if (i < n && /[A-Za-z0-9]/.test(s[i])) return -1
  while (i < n) {
    const c = s[i]
    if (c === '>') return i + 1
    if (c === '"' || c === "'") {
      const q = c
      i++
      while (i < n && s[i] !== q) i++
      if (i < n) i++
      continue
    }
    i++
  }
  return -1
}

/** First `</tag>` after `from` (case-insensitive; allows whitespace like `< / script >`). */
function findClosingSpecialTag(
  s: string,
  from: number,
  tag: typeof SCRIPT_NAME | typeof STYLE_NAME
): number {
  const n = s.length
  let i = from
  while (i < n) {
    const lt = s.indexOf('<', i)
    if (lt === -1) return -1
    let j = lt + 1
    while (j < n && /\s/.test(s[j])) j++
    if (j >= n || s[j] !== '/') {
      i = lt + 1
      continue
    }
    j++
    while (j < n && /\s/.test(s[j])) j++
    if (j + tag.length > n) return -1
    if (s.slice(j, j + tag.length).toLowerCase() !== tag) {
      i = lt + 1
      continue
    }
    j += tag.length
    if (j < n && /[A-Za-z0-9]/.test(s[j])) {
      i = lt + 1
      continue
    }
    while (j < n && /\s/.test(s[j])) j++
    if (j < n && s[j] === '>') return j + 1
    i = lt + 1
  }
  return -1
}

function removeScriptAndStyleBlocks(s: string): string {
  const buf: string[] = []
  let pos = 0
  while (pos < s.length) {
    const lt = s.indexOf('<', pos)
    if (lt === -1) {
      buf.push(s.slice(pos))
      break
    }
    buf.push(s.slice(pos, lt))
    const scriptEnd = findSpecialElementOpenEnd(s, lt, SCRIPT_NAME)
    if (scriptEnd !== -1) {
      const close = findClosingSpecialTag(s, scriptEnd, SCRIPT_NAME)
      if (close !== -1) {
        pos = close
        continue
      }
      return buf.join('')
    }
    const styleEnd = findSpecialElementOpenEnd(s, lt, STYLE_NAME)
    if (styleEnd !== -1) {
      const close = findClosingSpecialTag(s, styleEnd, STYLE_NAME)
      if (close !== -1) {
        pos = close
        continue
      }
      return buf.join('')
    }
    buf.push('<')
    pos = lt + 1
  }
  return buf.join('')
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
    s = removeGenericHtmlTags(removeScriptAndStyleBlocks(decoded))
  }
  return s
}
