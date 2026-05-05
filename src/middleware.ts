import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { handlePreflight, applyCorsHeaders } from '@/middleware/cors'
import { applyApiRateLimit } from '@/middleware/api-rate-limit'
import { enforceAuth } from '@/middleware/auth-guard'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static assets bypass everything
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

  // CORS preflight
  const preflightResponse = handlePreflight(request)
  if (preflightResponse) return preflightResponse

  // API routes: rate limiting + CORS headers
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = applyApiRateLimit(request)
    if (rateLimitResponse) return rateLimitResponse

    const apiResponse = NextResponse.next()
    applyCorsHeaders(request, apiResponse)
    return apiResponse
  }

  // Only enforce auth for routes this middleware is configured to guard.
  // The config.matcher already limits invocation in production; this guard
  // ensures the function is safe when called directly in tests or other contexts.
  const isProtectedPath =
    pathname.startsWith('/profile') || pathname.startsWith('/dashboard')
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  const authResponse = await enforceAuth(request)
  if (authResponse) return authResponse

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/profile/:path*', '/dashboard/:path*'],
}
