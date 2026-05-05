'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { AUTH_RATE_LIMITS, getClientIp } from './_shared'

export const forgotPasswordAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(
    `forgotPassword:${ip}`,
    AUTH_RATE_LIMITS.forgotPassword
  )
  if (!success) {
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Too many attempts. Please try again later.'
    )
  }

  const email = formData.get('email')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?type=recovery`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password'
    )
  }

  console.info(
    JSON.stringify({
      event: 'auth.forgot_password',
      email,
      ip,
      ts: new Date().toISOString(),
    })
  )

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.'
  )
}
