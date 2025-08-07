import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    response.headers.set(
      'Access-Control-Allow-Origin',
      request.headers.get('origin') || '*'
    )
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Add CORS headers to API responses
    const apiResponse = NextResponse.next()
    apiResponse.headers.set(
      'Access-Control-Allow-Origin',
      request.headers.get('origin') || '*'
    )
    apiResponse.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS'
    )
    apiResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
    apiResponse.headers.set('Access-Control-Allow-Credentials', 'true')

    // For API routes, we don't redirect, just return the response
    if (request.method === 'OPTIONS') {
      return apiResponse
    }

    return apiResponse
  }

  // Handle auth routes
  if (pathname.startsWith('/auth/')) {
    return response
  }

  // Handle static files and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/forgot-password' ||
    pathname === '/auth/callback/github' ||
    pathname === '/auth/callback/error' ||
    pathname === '/' ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/projects/')
  ) {
    return response
  }

  // Try to create Supabase client and get session, but handle failures gracefully
  let session = null
  let isSupabasePaused = false

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Get the current session
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      // Check if it's a paused project error
      if (
        error.message.includes('paused') ||
        error.message.includes('suspended') ||
        error.message.includes('unavailable') ||
        error.code === 'PGRST301' || // Service unavailable
        error.code === 'PGRST302'
      ) {
        // Service paused
        isSupabasePaused = true
        console.warn('Supabase project is paused:', error.message)
      } else {
        console.error('Supabase auth error:', error)
      }
    } else {
      session = currentSession
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    // Continue without session - treat as unauthenticated
  }

  // If Supabase is paused, allow access to public routes but redirect protected routes
  if (isSupabasePaused) {
    // Allow access to public routes even when Supabase is paused
    if (
      pathname === '/' ||
      pathname.startsWith('/posts/') ||
      pathname.startsWith('/projects/') ||
      pathname === '/sign-in' ||
      pathname === '/sign-up' ||
      pathname === '/forgot-password'
    ) {
      return response
    }

    // For protected routes, redirect to sign-in with a special error
    const protectedRoutes = ['/protected', '/dashboard']
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isProtectedRoute) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('error', 'supabase_paused')
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  }

  // If user is not signed in and the path is not public, redirect to sign-in
  if (!session) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/protected', request.url))
  }

  // Allow access to the homepage for all users
  if (pathname === '/') {
    return response
  }

  // Protected routes
  const protectedRoutes = ['/protected', '/dashboard']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // If there's no session, redirect to sign-in
    if (!session) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Set CORS headers for all responses
  response.headers.set(
    'Access-Control-Allow-Origin',
    request.headers.get('origin') || '*'
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback).*)'],
}
