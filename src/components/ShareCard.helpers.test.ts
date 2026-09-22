import {
  SHARE_CARD_TITLE_MAX,
  formatShareCardDate,
  joinShareCardMeta,
  shareCardTitleSize,
  truncateShareCardTitle,
} from './ShareCard.helpers'

describe('shareCardTitleSize', () => {
  it('sets short titles largest and steps down as titles grow', () => {
    const sizes = [10, 40, 70, 100].map((n) => shareCardTitleSize('a'.repeat(n)))
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a))
    expect(new Set(sizes).size).toBe(4)
  })
})

describe('truncateShareCardTitle', () => {
  it('leaves a title that fits alone', () => {
    expect(truncateShareCardTitle('  Back to You  ')).toBe('Back to You')
  })

  it('cuts at a word boundary and adds an ellipsis', () => {
    const long = 'word '.repeat(40).trim()
    const result = truncateShareCardTitle(long)

    expect(result.length).toBeLessThanOrEqual(SHARE_CARD_TITLE_MAX)
    expect(result.endsWith('word…')).toBe(true)
  })

  it('hard-cuts a title with no usable space', () => {
    const result = truncateShareCardTitle('x'.repeat(200), 20)
    expect(result).toBe(`${'x'.repeat(19)}…`)
  })

  it('drops trailing punctuation before the ellipsis', () => {
    expect(truncateShareCardTitle('Clarity leads, to growth today', 16)).toBe(
      'Clarity leads…'
    )
  })
})

describe('formatShareCardDate', () => {
  it('formats an ISO date in UTC', () => {
    expect(formatShareCardDate('2026-01-02')).toBe('Jan 2, 2026')
  })

  it('throws on an unparseable date', () => {
    expect(() => formatShareCardDate('not a date')).toThrow('invalid date')
  })
})

describe('joinShareCardMeta', () => {
  it('skips empty fragments', () => {
    expect(joinShareCardMeta(['2024', undefined, ' ', 'React'])).toBe(
      '2024 · React'
    )
  })
})
