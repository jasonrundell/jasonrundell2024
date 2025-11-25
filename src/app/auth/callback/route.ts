import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createClient()

    // Check if this is a password recovery flow
    if (type === 'recovery') {
      // For password recovery, we don't want to create a session
      // Just validate that the recovery code exists and redirect
      // The actual password reset will happen on the reset password page
      return NextResponse.redirect(`${origin}/reset-password?token=${code}`)
    } else {
      // For other auth flows (sign up, sign in), proceed normally
      await supabase.auth.exchangeCodeForSession(code)
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/profile`)
}
