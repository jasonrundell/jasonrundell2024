import { rateLimit, _clearStore } from './rate-limit'
import type { RateLimitConfig } from './rate-limit'

afterEach(() => {
  _clearStore()
})

const config: RateLimitConfig = { maxAttempts: 3, windowMs: 10_000 }

describe('rateLimit', () => {
  it('allows requests within the limit', () => {
    const r1 = rateLimit('test-key', config)
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(2)

    const r2 = rateLimit('test-key', config)
    expect(r2.success).toBe(true)
    expect(r2.remaining).toBe(1)

    const r3 = rateLimit('test-key', config)
    expect(r3.success).toBe(true)
    expect(r3.remaining).toBe(0)
  })

  it('blocks requests exceeding the limit', () => {
    rateLimit('block-key', config)
    rateLimit('block-key', config)
    rateLimit('block-key', config)

    const r4 = rateLimit('block-key', config)
    expect(r4.success).toBe(false)
    expect(r4.remaining).toBe(0)

    const r5 = rateLimit('block-key', config)
    expect(r5.success).toBe(false)
    expect(r5.remaining).toBe(0)
  })

  it('tracks keys independently', () => {
    rateLimit('key-a', config)
    rateLimit('key-a', config)
    rateLimit('key-a', config)

    const blocked = rateLimit('key-a', config)
    expect(blocked.success).toBe(false)

    const allowed = rateLimit('key-b', config)
    expect(allowed.success).toBe(true)
    expect(allowed.remaining).toBe(2)
  })

  it('resets after the window expires', () => {
    jest.useFakeTimers()

    rateLimit('expire-key', config)
    rateLimit('expire-key', config)
    rateLimit('expire-key', config)

    const blocked = rateLimit('expire-key', config)
    expect(blocked.success).toBe(false)

    jest.advanceTimersByTime(config.windowMs + 1)

    const allowed = rateLimit('expire-key', config)
    expect(allowed.success).toBe(true)
    expect(allowed.remaining).toBe(2)

    jest.useRealTimers()
  })

  it('uses a sliding window (oldest requests expire first)', () => {
    jest.useFakeTimers()

    rateLimit('slide-key', config)

    jest.advanceTimersByTime(5_000)
    rateLimit('slide-key', config)

    jest.advanceTimersByTime(3_000)
    rateLimit('slide-key', config)

    // At t=8s, all 3 slots used. First request was at t=0, window is 10s.
    const blocked = rateLimit('slide-key', config)
    expect(blocked.success).toBe(false)

    // Advance to t=10.001s — first request (t=0) falls out of window
    jest.advanceTimersByTime(2_001)
    const allowed = rateLimit('slide-key', config)
    expect(allowed.success).toBe(true)

    jest.useRealTimers()
  })

  it('supports different configs per key', () => {
    const strict: RateLimitConfig = { maxAttempts: 1, windowMs: 60_000 }
    const relaxed: RateLimitConfig = { maxAttempts: 10, windowMs: 60_000 }

    const r1 = rateLimit('strict-key', strict)
    expect(r1.success).toBe(true)

    const r2 = rateLimit('strict-key', strict)
    expect(r2.success).toBe(false)

    for (let i = 0; i < 10; i++) {
      const r = rateLimit('relaxed-key', relaxed)
      expect(r.success).toBe(true)
    }

    const r3 = rateLimit('relaxed-key', relaxed)
    expect(r3.success).toBe(false)
  })

  it('_clearStore resets all rate limit data', () => {
    rateLimit('clear-key', { maxAttempts: 1, windowMs: 60_000 })

    const blocked = rateLimit('clear-key', { maxAttempts: 1, windowMs: 60_000 })
    expect(blocked.success).toBe(false)

    _clearStore()

    const allowed = rateLimit('clear-key', { maxAttempts: 1, windowMs: 60_000 })
    expect(allowed.success).toBe(true)
  })
})
