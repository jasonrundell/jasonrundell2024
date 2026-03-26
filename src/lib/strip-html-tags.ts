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

/** Placeholders for angle brackets that came from character references (DOMPurify keeps these as text). */
const MARK_LT = '\uE000'
const MARK_GT = '\uE001'

/**
 * Remove PUA sentinels only from raw user input. They must never appear in the
 * incoming string: otherwise they survive tag stripping and `unshieldAngleBrackets`
 * turns them into real `<` / `>` (XSS if stored HTML is ever rendered).
 * Stripping here does not affect entity-based shielding (`&lt;` has no U+E000 until decoded).
 */
function stripUserPrivateUseSentinels(s: string): string {
  return s.replaceAll(MARK_LT, '').replaceAll(MARK_GT, '')
}

/**
 * Replace entity-encoded `<` / `>` with placeholders so tag stripping only
 * sees literally typed angle brackets. Matches HTML parsing: `&lt;div&gt;` is
 * text, not a `<div>` element.
 */
function shieldEncodedAngleBrackets(s: string): string {
  let out = s
  let prev = ''
  while (out !== prev) {
    prev = out
    out = out
      .replace(/&lt;/gi, MARK_LT)
      .replace(/&gt;/gi, MARK_GT)
    out = out.replace(/&#(\d+);/g, (full, digits: string) => {
      const n = Number.parseInt(digits, 10)
      if (n === 60) {
        return MARK_LT
      }
      if (n === 62) {
        return MARK_GT
      }
      return full
    })
    out = out.replace(/&#x([0-9a-f]+);/gi, (full, hex: string) => {
      const n = Number.parseInt(hex, 16)
      if (n === 60) {
        return MARK_LT
      }
      if (n === 62) {
        return MARK_GT
      }
      return full
    })
  }
  return out
}

function unshieldAngleBrackets(s: string): string {
  return s.replaceAll(MARK_LT, '<').replaceAll(MARK_GT, '>')
}

/**
 * Decode HTML entities (named + numeric) once. Caller loops until stable.
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
 * Aligns with `DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })` for script/style:
 * those elements and their inner content are removed, not only the tags.
 *
 * Entity-encoded angle brackets (`&lt;div&gt;`, etc.) are treated as text
 * (like the HTML tokenizer), not as tag delimiters: they are shielded before
 * stripping, then restored. Literally typed `<script>...</script>` is still
 * removed. Double-encoded `&amp;lt;` is not unfolded during shielding, so it
 * stays harmless text through the strip phase (DOMPurify keeps it encoded).
 */
export function stripHtmlTags(input: string): string {
  let s = stripUserPrivateUseSentinels(input)
  let prev = ''
  while (s !== prev) {
    prev = s
    const shielded = shieldEncodedAngleBrackets(s)
    s = removeGenericHtmlTags(removeScriptAndStyleBlocks(shielded))
  }
  s = unshieldAngleBrackets(s)
  prev = ''
  while (s !== prev) {
    prev = s
    s = decodeHtmlEntitiesOnce(s)
  }
  return s
}
