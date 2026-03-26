import { stripHtmlTags } from './strip-html-tags'

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

  it('leaves invalid numeric decimal references unchanged (e.g. out of Unicode range)', () => {
    expect(stripHtmlTags('&#1114112;')).toBe('&#1114112;')
  })

  it('leaves invalid numeric hex references unchanged (e.g. out of Unicode range)', () => {
    expect(stripHtmlTags('&#x110000;')).toBe('&#x110000;')
  })

  it('decodes the maximum valid Unicode scalar via hex NCR', () => {
    expect(stripHtmlTags('&#x10FFFF;')).toBe('\u{10FFFF}')
  })

})
