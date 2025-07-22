import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
    data: { session },
  } = await supabase.auth.getSession()
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
    pathname === '/'
  ) {
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
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
