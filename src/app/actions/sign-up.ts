'use server'

import { encodedRedirect } from '@/utils/utils'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { normalizeProfileSlug } from '@/lib/profile-slug'
import {
  AUTH_RATE_LIMITS,
  getClientIp,
  signUpSchema,
} from './_shared'

export const signUpAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(`signUp:${ip}`, AUTH_RATE_LIMITS.signUp)
  if (!success) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Too many sign-up attempts. Please try again later.'
    )
  }

  const rawData = {
    displayName: formData.get('displayName')?.toString(),
    profileSlug: normalizeProfileSlug(
      formData.get('profileSlug')?.toString() ?? ''
    ),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }

  const validationResult = signUpSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues
      .map((e) => e.message)
      .join(', ')
    return encodedRedirect('error', '/sign-up', errorMessage)
  }

  const { displayName, profileSlug, email, password } = validationResult.data
  const safeClient = createSafeClient()
  const origin = (await headers()).get('origin')

  const slugTakenCheck = await safeClient.execute(async () => {
    const supabase = await import('@/utils/supabase/server').then((m) =>
      m.createClient()
    )
    return await supabase
      .from('public_user_profiles')
      .select('profile_slug')
      .eq('profile_slug', profileSlug)
      .maybeSingle()
  })

  if (slugTakenCheck.isAvailable && slugTakenCheck.data) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'That profile URL is already taken. Please choose another.'
    )
  }

  const {
    data: signUpData,
    error,
    isPaused,
    isAvailable,
  } = await safeClient.execute(async () => {
    const supabase = await import('@/utils/supabase/server').then((m) =>
      m.createClient()
    )
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })
    return {
      data: result.data,
      error: result.error,
    }
  })

  if (!isAvailable) {
    if (isPaused) {
      return encodedRedirect(
        'error',
        '/sign-up',
        'Database is currently paused. Please resume your Supabase project to continue.'
      )
    }
    return encodedRedirect(
      'error',
      '/sign-up',
      'Database is unavailable. Please try again later.'
    )
  }

  if (error) {
    console.error('Sign up error:', error)
    return encodedRedirect('error', '/sign-up', error)
  }

  console.info(
    JSON.stringify({
      event: 'auth.signup',
      email,
      ip,
      ts: new Date().toISOString(),
    })
  )

  const authUserId =
    signUpData &&
    typeof signUpData === 'object' &&
    'user' in signUpData
      ? (signUpData as { user?: { id?: string } }).user?.id
      : undefined

  try {
    await safeClient.insertUser({
      email,
      full_name: displayName,
      auth_user_id: authUserId || null,
      profile_slug: profileSlug,
      profile_slug_changed_at: new Date().toISOString(),
      provider: 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (userError) {
    console.error('Failed to create user record:', userError)
  }

  return encodedRedirect(
    'success',
    '/sign-up',
    'Thanks for signing up! Please check your email for a verification link.'
  )
}
