import { NextRequest, NextResponse } from 'next/server'
import { CACHE_DURATIONS } from '@/lib/constants'
import { getOrCreateSupabaseClient } from './supabase-cache'

export async function enforceAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  const supabaseClient = getOrCreateSupabaseClient(request)
  if (!supabaseClient) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('error', 'auth_error')
    return NextResponse.redirect(redirectUrl)
  }

  let authenticatedUser = null
  let isSupabasePaused = false

  try {
    const userPromise = supabaseClient.auth.getUser()
    const timeoutPromise = new Promise<{
      data: { user: null }
      error: Error
    }>((_, reject) =>
      setTimeout(
        () => reject(new Error('Auth verification timeout')),
        CACHE_DURATIONS.SESSION_TIMEOUT
      )
    )

    const {
      data: { user },
      error,
    } = await Promise.race([userPromise, timeoutPromise])

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
      authenticatedUser = user
    }
  } catch (error) {
    console.error('Auth verification failed:', error)
  }

  if (isSupabasePaused) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('error', 'supabase_paused')
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (!authenticatedUser) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return null
}
