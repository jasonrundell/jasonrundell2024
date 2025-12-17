import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

    const cookieStore = cookies()
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
    const { error } = await supabase.from('users').select('id').limit(1)

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

      return NextResponse.json(
        {
          isAvailable: false,
          isPaused: false,
          error: error.message,
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
    return NextResponse.json(
      {
        isAvailable: false,
        isPaused: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
