import { sanitizeHTML } from './sanitize'

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
