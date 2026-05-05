import { getSupabaseUrl, getSupabaseAnonKey } from './env'

describe('getSupabaseUrl', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
  })

  it('returns the URL when set', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    expect(getSupabaseUrl()).toBe('https://test.supabase.co')
  })

  it('throws when env var is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(() => getSupabaseUrl()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/)
  })
})

describe('getSupabaseAnonKey', () => {
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })

  it('returns the key when set', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    expect(getSupabaseAnonKey()).toBe('test-anon-key')
  })

  it('throws when env var is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(() => getSupabaseAnonKey()).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/)
  })
})

describe('hasSupabaseEnv', () => {
  it('is importable and returns a boolean', async () => {
    const { hasSupabaseEnv } = await import('./env')
    expect(typeof hasSupabaseEnv()).toBe('boolean')
  })
})
