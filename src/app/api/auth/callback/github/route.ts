import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// Helper function to get the base URL
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return (
    process.env.NEXT_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 3000}`
  )
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_URL || '*'
  )
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error(
        'GitHub OAuth error:',
        error,
        searchParams.get('error_description')
      )
      return NextResponse.redirect(`/sign-in?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No code provided in callback URL')
      return NextResponse.redirect('/sign-in?error=no_code')
    }

    // Verify we have all required environment variables
    if (
      !process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
      !process.env.GITHUB_CLIENT_SECRET ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error('Missing required environment variables')
      return NextResponse.redirect('/login?error=configuration')
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    )

    const data = await tokenResponse.json()

    if (!data.access_token) {
      console.error('No access token in response:', data)
      return NextResponse.redirect('/login?error=no_token')
    }

    // Get user info
    let user
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${data.access_token}`,
          Accept: 'application/json',
        },
      })

      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error('Failed to get user info:', {
          status: userResponse.status,
          statusText: userResponse.statusText,
          headers: Object.fromEntries(userResponse.headers.entries()),
          error: errorText,
        })
        return NextResponse.redirect(`/sign-in?error=user_info_fetch`)
      }

      user = await userResponse.json()
      console.log('GitHub user data received:', JSON.stringify(user, null, 2))

      // Ensure we have the minimum required data
      if (!user.id) {
        console.error('GitHub user data is missing required fields:', user)
        return NextResponse.redirect('/sign-in?error=invalid_user_data')
      }
    } catch (error) {
      console.error('Error fetching GitHub user data:', error)
      return NextResponse.redirect('/sign-in?error=github_api_error')
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      }
    )

    // Ensure we have at least an email or a fallback
    const userEmail = user.email || `${user.id}@github.com`
    console.log('Looking up user with email:', userEmail)

    // Check if user exists in your database
    let existingUser = null
    let userError = null

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single()

      existingUser = data
      userError = error
    } catch (error) {
      // Check if it's a paused project error
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message
        if (
          errorMessage.includes('paused') ||
          errorMessage.includes('suspended') ||
          errorMessage.includes('unavailable')
        ) {
          console.error('Supabase project is paused:', errorMessage)
          return NextResponse.redirect(
            new URL('/sign-in?error=supabase_paused', getBaseUrl())
          )
        }
      }
      throw error
    }

    if (userError) {
      if (userError.code === 'PGRST116') {
        console.log('No existing user found, will create new user')
      } else {
        console.error('Error checking for existing user:', userError)
        throw userError
      }
    } else {
      console.log('Found existing user:', existingUser)
    }

    // Create or update user in your database
    const userData = {
      email: userEmail,
      username: user.login,
      full_name: user.name || user.login,
      avatar_url: user.avatar_url,
      github_id: user.id,
      provider: 'github',
      updated_at: new Date().toISOString(),
    }

    console.log('User data to save:', JSON.stringify(userData, null, 2))

    try {
      if (!existingUser) {
        console.log(
          'Attempting to create new user with data:',
          JSON.stringify(userData, null, 2)
        )
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single()

        if (createError) {
          console.error('Error creating user:', {
            message: createError.message,
            code: createError.code,
            details: createError.details,
            hint: createError.hint,
            ...(createError as unknown as Record<string, unknown>),
          })
          throw createError
        }
        console.log('Successfully created user:', newUser)
      } else {
        console.log(
          'Attempting to update existing user with data:',
          JSON.stringify(userData, null, 2)
        )
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update(userData)
          .eq('email', userData.email)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating user:', {
            message: updateError.message,
            code: updateError.code,
            details: updateError.details,
            hint: updateError.hint,
            ...(updateError as unknown as Record<string, unknown>),
          })
          throw updateError
        }
        console.log('Successfully updated user:', updatedUser)
      }
    } catch (dbError) {
      console.error('Database operation failed with error:', dbError)

      // Check if it's a paused project error
      if (dbError && typeof dbError === 'object' && 'message' in dbError) {
        const errorMessage = (dbError as any).message
        if (
          errorMessage.includes('paused') ||
          errorMessage.includes('suspended') ||
          errorMessage.includes('unavailable')
        ) {
          console.error(
            'Supabase project is paused during database operation:',
            errorMessage
          )
          return NextResponse.redirect(
            new URL('/sign-in?error=supabase_paused', getBaseUrl())
          )
        }
      }

      // Log additional error details if available
      if (dbError && typeof dbError === 'object') {
        const errorDetails = {
          name: (dbError as Error).name,
          message: (dbError as Error).message,
          stack: (dbError as Error).stack,
          ...(dbError as unknown as Record<string, unknown>),
        }
        console.error(
          'Full error details:',
          JSON.stringify(errorDetails, null, 2)
        )
      } else {
        console.error('Non-Error object thrown:', dbError)
      }

      throw new Error(
        `Database operation failed: ${
          dbError instanceof Error ? dbError.message : 'Unknown error'
        }`
      )
    }

    // Create a session for the user
    const baseUrl = getBaseUrl()
    const redirectTo = new URL('/protected', baseUrl).toString()

    console.log('Creating auth session with redirect to:', redirectTo)

    // Use the auth helpers to handle the session
    const cookieStore = cookies()
    const supabaseAuth = createRouteHandlerClient({
      cookies: () => cookieStore,
    })

    // Sign in with OAuth
    const { data: authData, error: authError } =
      await supabaseAuth.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

    if (authError) {
      console.error('Error creating auth session:', authError)
      return NextResponse.redirect(
        new URL(
          `/sign-in?error=auth_session&details=${encodeURIComponent(
            authError.message
          )}`,
          baseUrl
        )
      )
    }

    if (!authData.url) {
      console.error('No URL returned from auth session creation')
      return NextResponse.redirect(
        new URL('/sign-in?error=no_auth_url', baseUrl)
      )
    }

    console.log('Auth successful, redirecting to:', authData.url)
    return NextResponse.redirect(authData.url)
  } catch (error) {
    console.error('GitHub callback error:', error)

    // Log the full error details for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        // Include any additional properties that might be on the error
        ...(error as unknown as Record<string, unknown>),
      })
    } else {
      console.error('Non-Error object thrown:', error)
    }

    const baseUrl = getBaseUrl()
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('GitHub callback error:', errorMessage)
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=server_error&details=${encodeURIComponent(
          errorMessage
        )}`,
        baseUrl
      )
    )
  }
}
