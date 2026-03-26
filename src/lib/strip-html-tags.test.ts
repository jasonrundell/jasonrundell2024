import { stripHtmlTags } from './strip-html-tags'

describe('stripHtmlTags', () => {
  it('returns plain text unchanged', () => {
    expect(stripHtmlTags('hello world')).toBe('hello world')
  })

  it('strips simple HTML tags', () => {
    expect(stripHtmlTags('<b>bold</b>')).toBe('bold')
  })

  it('removes script elements and their inner content (DOMPurify parity)', () => {
    expect(stripHtmlTags('<script>alert("xss")</script>')).toBe('')
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

  it('strips full tags when `>` appears inside a double-quoted attribute', () => {
    expect(stripHtmlTags('<img src=">" onerror="alert(1)">')).toBe('')
  })

  it('strips full tags when `>` appears inside a single-quoted attribute', () => {
    expect(stripHtmlTags("<img src='>' alt='x'>")).toBe('')
  })

  it('removes script blocks when opening tag has `>` inside a quoted attribute', () => {
    expect(stripHtmlTags('<script type=">">alert(1)</script>')).toBe('')
  })

  it('preserves entity-encoded angle brackets as text (DOMPurify parity; e.g. discussing HTML)', () => {
    expect(stripHtmlTags('&lt;div&gt;')).toBe('<div>')
    expect(stripHtmlTags('&lt;script&gt;alert(1)&lt;/script&gt;')).toBe(
      '<script>alert(1)</script>'
    )
  })

  it('keeps double-encoded markup as text after decode (no silent loss)', () => {
    expect(stripHtmlTags('&amp;lt;script&amp;gt;x&amp;lt;/script&amp;gt;')).toBe(
      '<script>x</script>'
    )
  })

  it('preserves angle brackets from numeric character references as text', () => {
    expect(stripHtmlTags('&#60;script&#62;y&#60;/script&#62;')).toBe(
      '<script>y</script>'
    )
  })

  it('strips script tags when there is whitespace after the opening bracket', () => {
    expect(stripHtmlTags('< script>alert(1)< /script>')).toBe('')
  })

  it('removes style elements and their inner content', () => {
    expect(stripHtmlTags('a<style>.x{color:red}</style>b')).toBe('ab')
  })

  it('preserves text around removed script blocks', () => {
    expect(stripHtmlTags('hello<script>x</script>world')).toBe('helloworld')
  })

  it('drops text after an unclosed script start tag', () => {
    expect(stripHtmlTags('before<script>never closed')).toBe('before')
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

  it('leaves surrogate lone code points as decimal NCRs (avoids RangeError)', () => {
    expect(stripHtmlTags('&#55296;')).toBe('&#55296;')
    expect(stripHtmlTags('&#57343;')).toBe('&#57343;')
  })

  it('leaves surrogate lone code points as hex NCRs (avoids RangeError)', () => {
    expect(stripHtmlTags('&#xD800;')).toBe('&#xD800;')
    expect(stripHtmlTags('&#xdfff;')).toBe('&#xdfff;')
  })

})
