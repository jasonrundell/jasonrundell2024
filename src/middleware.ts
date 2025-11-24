import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { CACHE_DURATIONS, ALLOWED_ORIGINS } from '@/lib/constants'

// Cache for Supabase client to avoid recreating on every request
let supabaseClient: ReturnType<typeof createServerClient> | null = null
let lastClientCreation = 0

// Memory management
let cacheCleanupTimer: NodeJS.Timeout | null = null

/**
 * Cleans up cached Supabase client if it's older than MAX_CACHE_AGE.
 */
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

// Set up periodic cleanup
if (typeof global !== 'undefined') {
  if (cacheCleanupTimer) {
    clearInterval(cacheCleanupTimer)
  }
  cacheCleanupTimer = setInterval(
    cleanupCache,
    CACHE_DURATIONS.CLEANUP_INTERVAL
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Early return for static assets and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/characters/') ||
    pathname.startsWith('/jason-rundell-web-developer-resume.pdf') ||
    pathname.startsWith('/VCR_OSD_MONO_1.001.ttf')
  ) {
    return NextResponse.next()
  }

  // Handle CORS preflight with origin whitelist
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin')
    const allowedOrigin =
      origin && ALLOWED_ORIGINS.includes(origin) ? origin : null

    const response = new NextResponse(null, { status: 204 })
    if (allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  // Handle API routes with minimal overhead
  if (pathname.startsWith('/api/')) {
    const apiResponse = NextResponse.next()
    // Only add CORS headers for non-OPTIONS requests
    if (request.method !== 'OPTIONS') {
      const origin = request.headers.get('origin')
      const allowedOrigin =
        origin && ALLOWED_ORIGINS.includes(origin) ? origin : null

      if (allowedOrigin) {
        apiResponse.headers.set('Access-Control-Allow-Origin', allowedOrigin)
        apiResponse.headers.set(
          'Access-Control-Allow-Methods',
          'GET, POST, OPTIONS'
        )
        apiResponse.headers.set(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization'
        )
        apiResponse.headers.set('Access-Control-Allow-Credentials', 'true')
      }
    }
    return apiResponse
  }

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/auth/callback/error',
    '/supabase-status',
  ]

  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/projects/')
  ) {
    return NextResponse.next()
  }

  // Handle auth routes
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // Only check authentication for protected routes
  const protectedRoutes = ['/profile', '/dashboard']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Create Supabase client with caching and memory management
  const now = Date.now()
  if (
    !supabaseClient ||
    now - lastClientCreation > CACHE_DURATIONS.CLIENT_CACHE
  ) {
    try {
      // Clean up old client if it exists
      if (supabaseClient) {
        try {
          // Close any open connections
          if (
            supabaseClient.auth &&
            typeof supabaseClient.auth.onAuthStateChange === 'function'
          ) {
            // This is a best-effort cleanup
            supabaseClient = null
          }
        } catch {
          // Ignore cleanup errors
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
              // Don't set cookies in middleware for performance
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            remove(_name: string, _options: CookieOptions) {
              // Don't remove cookies in middleware for performance
            },
          },
        }
      )
      lastClientCreation = now
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      // Redirect to sign-in on client initialization failure
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Check session with timeout and memory protection
  let session = null
  let isSupabasePaused = false

  try {
    const sessionPromise = supabaseClient.auth.getSession()
    const timeoutPromise = new Promise<{
      data: { session: null }
      error: Error
    }>((_, reject) =>
      setTimeout(
        () => reject(new Error('Session timeout')),
        CACHE_DURATIONS.SESSION_TIMEOUT
      )
    )

    const {
      data: { session: currentSession },
      error,
    } = await Promise.race([sessionPromise, timeoutPromise])

    if (error) {
      if (
        error.message.includes('paused') ||
        error.message.includes('suspended') ||
        error.message.includes('unavailable') ||
        error.code === 'PGRST301' ||
        error.code === 'PGRST302'
      ) {
        isSupabasePaused = true
      }
    } else {
      session = currentSession
    }
  } catch (error) {
    console.error('Session check failed:', error)
    // Continue without session - treat as unauthenticated
  }

  // Handle Supabase paused state
  if (isSupabasePaused) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('error', 'supabase_paused')
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to sign-in if no session
  if (!session) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback).*)'],
}
