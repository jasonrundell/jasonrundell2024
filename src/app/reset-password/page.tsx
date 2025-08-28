import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ResetPasswordClient from '@/app/reset-password/reset-password-client'

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  // Check if we have a valid token for password reset
  if (!searchParams.token) {
    redirect('/forgot-password?error=missing_token')
  }

  // Check if user is already authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // User is already logged in, redirect to profile
    redirect('/profile')
  }

  return <ResetPasswordClient token={searchParams.token} />
}
