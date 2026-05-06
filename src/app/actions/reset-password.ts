'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { AUTH_RATE_LIMITS, getClientIp } from './_shared'

export const resetPasswordAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(
    `resetPassword:${ip}`,
    AUTH_RATE_LIMITS.resetPassword
  )
  if (!success) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'Too many attempts. Please try again later.'
    )
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'You are already logged in. If you need to change your password, please use the change password option in your profile.'
    )
  }

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const token = formData.get('token') as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'Password and confirm password are required'
    )
  }

  if (!token) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'Invalid or missing reset token'
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/reset-password', 'Passwords do not match')
  }

  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      token
    )

    if (exchangeError) {
      console.error('Token exchange error:', exchangeError)
      return encodedRedirect(
        'error',
        '/forgot-password',
        'The password reset link is invalid or has expired. Please request a new one.'
      )
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      return encodedRedirect(
        'error',
        '/reset-password',
        'Password update failed. Please try again.'
      )
    }

    await supabase.auth.signOut()

    console.info(
      JSON.stringify({
        event: 'auth.reset_password',
        ip,
        ts: new Date().toISOString(),
      })
    )
    return redirect('/sign-in?message=password_reset_success')
  } catch (error) {
    console.error('Unexpected error during password reset:', error)
    return encodedRedirect(
      'error',
      '/reset-password',
      'An unexpected error occurred. Please try again.'
    )
  }
}
