import { stripHtmlTags, sanitizeHTML } from './sanitize'

describe('stripHtmlTags', () => {
  it('returns plain text unchanged', () => {
    expect(stripHtmlTags('hello world')).toBe('hello world')
  })

  it('strips simple HTML tags', () => {
    expect(stripHtmlTags('<b>bold</b>')).toBe('bold')
  })

  it('strips script tags and their content markers', () => {
    expect(stripHtmlTags('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('strips nested tags', () => {
    expect(stripHtmlTags('<div><p>hello <em>world</em></p></div>')).toBe(
      'hello world'
    )
  })

  it('strips self-closing tags', () => {
    expect(stripHtmlTags('line1<br/>line2')).toBe('line1line2')
  })

  it('decodes common HTML entities', () => {
    expect(stripHtmlTags('&amp; &lt; &gt; &quot; &#39;')).toBe('& < > " \'')
  })

  it('decodes numeric hex slash entity regardless of hex digit casing', () => {
    expect(stripHtmlTags('a&#x2F;b')).toBe('a/b')
    expect(stripHtmlTags('a&#x2f;b')).toBe('a/b')
  })

  it('handles mixed tags and entities', () => {
    expect(stripHtmlTags('<p>A &amp; B</p>')).toBe('A & B')
  })

  it('returns empty string for empty input', () => {
    expect(stripHtmlTags('')).toBe('')
  })

  it('handles input with only tags', () => {
    expect(stripHtmlTags('<div><span></span></div>')).toBe('')
  })

  it('handles attributes in tags', () => {
    expect(stripHtmlTags('<a href="https://evil.com">click</a>')).toBe('click')
  })

  it('strips tags that only appear after entity decode (XSS via encoded angle brackets)', () => {
    expect(stripHtmlTags('&lt;script&gt;alert(1)&lt;/script&gt;')).toBe('alert(1)')
  })

  it('handles double-encoded entities that would become tags after one decode', () => {
    expect(stripHtmlTags('&amp;lt;script&amp;gt;x&amp;lt;/script&amp;gt;')).toBe('x')
  })

  it('strips tags expressed with numeric character references', () => {
    expect(stripHtmlTags('&#60;script&#62;y&#60;/script&#62;')).toBe('y')
  })

  it('strips script tags when there is whitespace after the opening bracket', () => {
    expect(stripHtmlTags('< script>alert(1)< /script>')).toBe('alert(1)')
  })
})

describe('sanitizeHTML', () => {
  it('preserves safe inline tags', () => {
    expect(sanitizeHTML('<b>test</b>')).toBe('<b>test</b>')
  })

  it('preserves italic and links', () => {
    const html = '<i>x</i> <a href="https://example.com">link</a>'
    const out = sanitizeHTML(html)
    expect(out).toContain('<i>')
    expect(out).toContain('<a')
    expect(out).toContain('https://example.com')
  })

  it('strips script tags', () => {
    const out = sanitizeHTML('<script>alert(1)</script>hello')
    expect(out).not.toMatch(/<script/i)
    expect(out).toContain('hello')
  })
})
