/**
 * Sliding window rate limiter using in-memory storage.
 *
 * Tracks request timestamps per key and rejects requests that exceed
 * the configured threshold within the sliding window.
 *
 * Suitable for single-instance or warm serverless environments (e.g. Vercel).
 * For distributed rate limiting across multiple instances, replace with
 * @upstash/ratelimit backed by Redis.
 */

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
}

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL_MS = 60_000
const MAX_WINDOW_MS = 600_000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter(
        (t) => now - t < MAX_WINDOW_MS
      )
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL_MS)
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    ;(cleanupTimer as NodeJS.Timeout).unref()
  }
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup()

  const now = Date.now()
  const windowStart = now - config.windowMs

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  if (entry.timestamps.length >= config.maxAttempts) {
    return { success: false, remaining: 0 }
  }

  entry.timestamps.push(now)
  return {
    success: true,
    remaining: config.maxAttempts - entry.timestamps.length,
  }
}

/** Clears all stored rate limit data. Exported for testing only. */
export function _clearStore() {
  store.clear()
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
}
