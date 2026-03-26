import { z } from 'zod'

export const PROFILE_SLUG_MIN = 3
export const PROFILE_SLUG_MAX = 30

/** Reserved path segments and app routes — cannot be used as profile slugs */
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'auth',
  'sign-in',
  'sign-up',
  'profile',
  'posts',
  'projects',
  'users',
  'u',
  'supabase-status',
  'forgot-password',
  'reset-password',
  'dashboard',
  'static',
  '_next',
])

export const profileSlugSchema = z
  .string()
  .min(PROFILE_SLUG_MIN, `Profile URL must be at least ${PROFILE_SLUG_MIN} characters`)
  .max(PROFILE_SLUG_MAX, `Profile URL must be at most ${PROFILE_SLUG_MAX} characters`)
  .regex(
    /^[a-z0-9-]+$/,
    'Use only lowercase letters, numbers, and hyphens'
  )
  .refine((s) => !s.startsWith('-') && !s.endsWith('-'), 'Cannot start or end with a hyphen')
  .refine((s) => !/--/.test(s), 'Cannot contain consecutive hyphens')
  .refine((s) => !RESERVED_SLUGS.has(s), 'This profile URL is reserved')

export const SLUG_CHANGE_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000

export function normalizeProfileSlug(input: string): string {
  return input.trim().toLowerCase()
}

export function isReservedProfileSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug)
}

/**
 * Whether the user may change their slug (90 days since last change).
 */
export function getSlugChangeEligibility(profileSlugChangedAt: string | null): {
  allowed: boolean
  nextChangeAt: Date | null
} {
  if (!profileSlugChangedAt) {
    return { allowed: true, nextChangeAt: null }
  }
  const changed = new Date(profileSlugChangedAt).getTime()
  const next = changed + SLUG_CHANGE_COOLDOWN_MS
  if (Number.isNaN(changed)) {
    return { allowed: true, nextChangeAt: null }
  }
  if (Date.now() >= next) {
    return { allowed: true, nextChangeAt: null }
  }
  return { allowed: false, nextChangeAt: new Date(next) }
}

/**
 * Deterministic initial slug for a new user (matches backfill style: base + uuid tail).
 */
export function generateInitialProfileSlug(
  displayNameOrEmailLocal: string,
  authUserId: string
): string {
  const raw = displayNameOrEmailLocal.trim().toLowerCase()
  const slugified = raw
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const base =
    slugified.length >= 3 ? slugified.slice(0, 20) : 'user'
  const tail = authUserId.replace(/-/g, '').slice(-8)
  const combined = `${base}-${tail}`
  return combined.slice(0, PROFILE_SLUG_MAX)
}
