import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if environment variables are available
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          isAvailable: false,
          isPaused: false,
          error: 'Supabase environment variables not configured',
        },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    )

    // Try a simple query to test connectivity
    const { error } = await supabase
      .from('public_user_profiles')
      .select('profile_slug')
      .limit(1)

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
        return NextResponse.json(
          {
            isAvailable: false,
            isPaused: true,
            error: 'Supabase project is currently paused',
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
          }
        )
      }

      console.error('Supabase status check error:', error.message)
      return NextResponse.json(
        {
          isAvailable: false,
          isPaused: false,
          error: 'Database connectivity error',
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      )
    }

    return NextResponse.json(
      {
        isAvailable: true,
        isPaused: false,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Supabase status check exception:', error)
    return NextResponse.json(
      {
        isAvailable: false,
        isPaused: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
