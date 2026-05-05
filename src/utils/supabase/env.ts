/**
 * Throwing Supabase environment variable accessors.
 *
 * Use these wherever the Supabase URL or anon key is required and the absence
 * of either is a hard error (i.e. every client except the SupabaseStatusBanner
 * which may render without a working Supabase connection).
 *
 * For the banner's graceful degradation, use `hasSupabaseEnv()` instead.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL'
    )
  }
  return url
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
  return key
}

/** Returns true only when both env vars are present — safe for UI-only checks. */
export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
