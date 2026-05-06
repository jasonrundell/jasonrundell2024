import { buildSegments, totalLength, sliceSegments } from './hero-terminal.helpers'

const fields = [
  { key: 'name', value: 'Jason' },
  { key: 'role', value: 'developer' },
]

describe('buildSegments', () => {
  it('starts with a comment segment', () => {
    const segs = buildSegments('hero.tsx', 'session', fields)
    expect(segs[0].role).toBe('comment')
    expect(segs[0].text).toContain('// hero.tsx')
  })

  it('includes keyword const', () => {
    const segs = buildSegments('hero.tsx', 'session', fields)
    const keyword = segs.find((s) => s.role === 'keyword')
    expect(keyword?.text).toBe('const')
  })

  it('includes identifier', () => {
    const segs = buildSegments('hero.tsx', 'session', fields)
    const identifier = segs.find((s) => s.role === 'identifier')
    expect(identifier?.text).toBe('session')
  })

  it('includes string values', () => {
    const segs = buildSegments('hero.tsx', 'session', fields)
    const strings = segs.filter((s) => s.role === 'string')
    expect(strings.map((s) => s.text)).toContain("'Jason'")
    expect(strings.map((s) => s.text)).toContain("'developer'")
  })

  it('last field does not have trailing comma', () => {
    const segs = buildSegments('hero.tsx', 'session', fields)
    const plains = segs.filter((s) => s.role === 'plain')
    const commaNewline = plains.find((s) => s.text === ',\n')
    const newline = plains.filter((s) => s.text === '\n')
    expect(commaNewline).toBeDefined()
    expect(newline.length).toBeGreaterThan(0)
  })
})

describe('totalLength', () => {
  it('sums up all segment text lengths', () => {
    const segs = [
      { text: 'abc', role: 'plain' as const },
      { text: 'de', role: 'keyword' as const },
    ]
    expect(totalLength(segs)).toBe(5)
  })

  it('returns 0 for empty segments', () => {
    expect(totalLength([])).toBe(0)
  })
})

describe('sliceSegments', () => {
  it('returns empty array when n is 0', () => {
    const segs = [{ text: 'hello', role: 'plain' as const }]
    expect(sliceSegments(segs, 0)).toEqual([])
  })

  it('returns full segments when n >= total', () => {
    const segs = [
      { text: 'ab', role: 'plain' as const },
      { text: 'cd', role: 'keyword' as const },
    ]
    expect(sliceSegments(segs, 10)).toEqual(segs)
  })

  it('splits a segment when n falls in the middle', () => {
    const segs = [{ text: 'hello', role: 'plain' as const }]
    const result = sliceSegments(segs, 3)
    expect(result).toEqual([{ text: 'hel', role: 'plain' }])
  })
})
