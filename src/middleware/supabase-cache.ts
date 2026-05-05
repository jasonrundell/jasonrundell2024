import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { CACHE_DURATIONS } from '@/lib/constants'

type SupabaseClient = ReturnType<typeof createServerClient>

let supabaseClient: SupabaseClient | null = null
let lastClientCreation = 0
let cacheCleanupTimer: NodeJS.Timeout | null = null

function cleanupCache() {
  const now = Date.now()
  if (
    supabaseClient &&
    now - lastClientCreation > CACHE_DURATIONS.MAX_CACHE_AGE
  ) {
    supabaseClient = null
    lastClientCreation = 0
  }
}

if (typeof global !== 'undefined') {
  if (cacheCleanupTimer) clearInterval(cacheCleanupTimer)
  cacheCleanupTimer = setInterval(cleanupCache, CACHE_DURATIONS.CLEANUP_INTERVAL)
}

export function getOrCreateSupabaseClient(
  request: NextRequest
): SupabaseClient | null {
  const now = Date.now()
  if (
    !supabaseClient ||
    now - lastClientCreation > CACHE_DURATIONS.CLIENT_CACHE
  ) {
    if (supabaseClient) {
      try {
        if (
          supabaseClient.auth &&
          typeof supabaseClient.auth.onAuthStateChange === 'function'
        ) {
          supabaseClient = null
        }
      } catch {
        // best-effort cleanup
      }
    }

    supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          set(_name: string, _value: string, _options: CookieOptions) {
            // Not set in middleware for performance
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          remove(_name: string, _options: CookieOptions) {
            // Not removed in middleware for performance
          },
        },
      }
    )
    lastClientCreation = now
  }

  return supabaseClient
}
