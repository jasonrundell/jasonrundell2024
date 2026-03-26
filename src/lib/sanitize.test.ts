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
})

describe('sanitizeHTML', () => {
  it('delegates to stripHtmlTags', () => {
    expect(sanitizeHTML('<b>test</b>')).toBe('test')
  })
})
