import {
  profileSlugSchema,
  normalizeProfileSlug,
  getSlugChangeEligibility,
  generateInitialProfileSlug,
  SLUG_CHANGE_COOLDOWN_MS,
} from './profile-slug'

describe('profileSlugSchema', () => {
  it('accepts valid slugs', () => {
    expect(profileSlugSchema.safeParse('jason-rundell').success).toBe(true)
    expect(profileSlugSchema.safeParse('ab3').success).toBe(true)
  })

  it('rejects reserved slugs', () => {
    expect(profileSlugSchema.safeParse('admin').success).toBe(false)
    expect(profileSlugSchema.safeParse('u').success).toBe(false)
  })

  it('rejects invalid characters', () => {
    expect(profileSlugSchema.safeParse('Bad').success).toBe(false)
    expect(profileSlugSchema.safeParse('a b').success).toBe(false)
  })
})

describe('normalizeProfileSlug', () => {
  it('trims and lowercases', () => {
    expect(normalizeProfileSlug('  Hello-World  ')).toBe('hello-world')
  })
})

describe('getSlugChangeEligibility', () => {
  it('allows when never changed', () => {
    const r = getSlugChangeEligibility(null)
    expect(r.allowed).toBe(true)
    expect(r.nextChangeAt).toBeNull()
  })

  it('blocks within 90 days', () => {
    const recent = new Date(Date.now() - SLUG_CHANGE_COOLDOWN_MS / 2).toISOString()
    const r = getSlugChangeEligibility(recent)
    expect(r.allowed).toBe(false)
    expect(r.nextChangeAt).toBeInstanceOf(Date)
  })

  it('allows after 90 days', () => {
    const old = new Date(Date.now() - SLUG_CHANGE_COOLDOWN_MS - 1000).toISOString()
    const r = getSlugChangeEligibility(old)
    expect(r.allowed).toBe(true)
  })
})

describe('generateInitialProfileSlug', () => {
  it('combines base and auth id tail', () => {
    const id = '7ef081b7-52b3-4818-be7a-6e160cbaee6e'
    const s = generateInitialProfileSlug('Jason', id)
    expect(s.length).toBeLessThanOrEqual(30)
    expect(s).toMatch(/^[a-z0-9-]+$/)
    const tail = id.replace(/-/g, '').slice(-8)
    expect(s.endsWith(tail)).toBe(true)
  })
})
