'use server'

import { z } from 'zod'
import { encodedRedirect } from '@/utils/utils'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { createClient } from '@/utils/supabase/server'
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_PATTERNS,
  getUnmetPasswordRequirementLabels,
} from '@/lib/password-validation'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { rateLimit, type RateLimitConfig } from '@/lib/rate-limit'
import {
  profileSlugSchema as profileSlugFieldSchema,
  normalizeProfileSlug,
  getSlugChangeEligibility,
} from '@/lib/profile-slug'

// Rate limit configurations (per IP)
const AUTH_RATE_LIMITS = {
  signIn: { maxAttempts: 5, windowMs: 60_000 } satisfies RateLimitConfig,
  signUp: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  forgotPassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  resetPassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  changePassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  updateProfileSlug: { maxAttempts: 5, windowMs: 60_000 } satisfies RateLimitConfig,
}

async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  )
}

// Validation schemas
const emailSchema = z.string().email('Invalid email address')
const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  )
  .regex(
    PASSWORD_PATTERNS.uppercase,
    'Password must contain at least one uppercase letter'
  )
  .regex(
    PASSWORD_PATTERNS.lowercase,
    'Password must contain at least one lowercase letter'
  )
  .regex(PASSWORD_PATTERNS.number, 'Password must contain at least one number')
  .regex(
    PASSWORD_PATTERNS.special,
    'Password must contain at least one special character'
  )

const displayNameSchema = z
  .string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be at most 50 characters')
  .trim()

const signUpSchema = z.object({
  displayName: displayNameSchema,
  profileSlug: profileSlugFieldSchema,
  email: emailSchema,
  password: passwordSchema,
})

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Server action for user sign up.
 * Validates input and creates a new user account.
 */
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

  // Validate input
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
      .from('users')
      .select('id')
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

  const { data: signUpData, error, isPaused, isAvailable } = await safeClient.execute(
    async () => {
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
    }
  )

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
  } else {
    console.info(
      JSON.stringify({ event: 'auth.signup', email, ip, ts: new Date().toISOString() })
    )

    const authUserId = signUpData && typeof signUpData === 'object' && 'user' in signUpData
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
}

/**
 * Server action for user sign in.
 * Validates input and authenticates the user.
 */
export const signInAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(`signIn:${ip}`, AUTH_RATE_LIMITS.signIn)
  if (!success) {
    return redirect('/sign-in?error=rate_limited')
  }

  const rawData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }

  // Validate input
  const validationResult = signInSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues.map((e) => e.message).join(', ') ||
      'Validation failed'
    return redirect(
      `/sign-in?error=validation_error&message=${encodeURIComponent(
        errorMessage
      )}`
    )
  }

  const { email, password } = validationResult.data
  const safeClient = createSafeClient()

  const { error, isPaused, isAvailable } = await safeClient.execute(
    async () => {
      const supabase = await import('@/utils/supabase/server').then((m) =>
        m.createClient()
      )
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return {
        data: result.data,
        error: result.error,
      }
    }
  )

  if (!isAvailable) {
    if (isPaused) {
      return redirect('/sign-in?error=supabase_paused')
    }
    return redirect('/sign-in?error=supabase_unavailable')
  }

  if (error) {
    console.error('Sign in error:', error)
    return redirect('/sign-in?error=auth_error')
  }

  console.info(
    JSON.stringify({ event: 'auth.signin', email, ip, ts: new Date().toISOString() })
  )
  return redirect('/profile')
}

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
    JSON.stringify({ event: 'auth.forgot_password', email, ip, ts: new Date().toISOString() })
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

  // Check if user is already authenticated
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
    // First, we need to exchange the recovery token for a session
    // This creates a temporary authenticated session that allows password update
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

    // Now update the password using the temporary session
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
      JSON.stringify({ event: 'auth.reset_password', ip, ts: new Date().toISOString() })
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

export const changePasswordAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(
    `changePassword:${ip}`,
    AUTH_RATE_LIMITS.changePassword
  )
  if (!success) {
    return encodedRedirect(
      'error',
      '/profile',
      'Too many attempts. Please try again later.'
    )
  }

  const currentPassword = formData.get('currentPassword')?.toString()
  const newPassword = formData.get('newPassword')?.toString()
  const confirmPassword = formData.get('confirmPassword')?.toString()
  const supabase = await createClient()

  if (!currentPassword || !newPassword || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/profile',
      'Current password, new password, and confirm password are required'
    )
  }

  if (newPassword !== confirmPassword) {
    return encodedRedirect('error', '/profile', 'New passwords do not match')
  }

  if (newPassword === currentPassword) {
    return encodedRedirect(
      'error',
      '/profile',
      'New password must be different from current password'
    )
  }

  const unmetRequirements = getUnmetPasswordRequirementLabels(newPassword)

  if (unmetRequirements.length > 0) {
    return encodedRedirect(
      'error',
      '/profile',
      `Password must contain: ${unmetRequirements.join(', ')}`
    )
  }

  // Get current user email
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user?.email) {
    return encodedRedirect(
      'error',
      '/profile',
      'Unable to retrieve user information'
    )
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  })

  if (signInError) {
    return encodedRedirect('error', '/profile', 'Current password is incorrect')
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return encodedRedirect('error', '/profile', 'Password update failed')
  }

  console.info(
    JSON.stringify({
      event: 'auth.change_password',
      email: userData.user.email,
      ip,
      ts: new Date().toISOString(),
    })
  )
  return encodedRedirect('success', '/profile', 'Password changed successfully')
}

export const updateDisplayNameAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(
    `updateDisplayName:${ip}`,
    AUTH_RATE_LIMITS.changePassword
  )
  if (!success) {
    return encodedRedirect(
      'error',
      '/profile',
      'Too many attempts. Please try again later.'
    )
  }

  const rawName = formData.get('displayName')?.toString()
  const parseResult = displayNameSchema.safeParse(rawName)
  if (!parseResult.success) {
    const errorMessage = parseResult.error.issues
      .map((e) => e.message)
      .join(', ')
    return encodedRedirect('error', '/profile', errorMessage)
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return encodedRedirect('error', '/profile', 'Unable to verify identity')
  }

  const safeClient = createSafeClient()
  const { error } = await safeClient.updateDisplayName(
    user.id,
    parseResult.data
  )

  if (error) {
    console.error('Display name update error:', error)
    return encodedRedirect('error', '/profile', 'Failed to update display name')
  }

  console.info(
    JSON.stringify({
      event: 'profile.update_display_name',
      userId: user.id,
      ip,
      ts: new Date().toISOString(),
    })
  )
  return encodedRedirect(
    'success',
    '/profile',
    'Display name updated successfully'
  )
}

export const updateProfileSlugAction = async (formData: FormData) => {
  const ip = await getClientIp()
  const { success } = rateLimit(
    `updateProfileSlug:${ip}`,
    AUTH_RATE_LIMITS.updateProfileSlug
  )
  if (!success) {
    return encodedRedirect(
      'error',
      '/profile',
      'Too many attempts. Please try again later.'
    )
  }

  const raw = normalizeProfileSlug(formData.get('profileSlug')?.toString() ?? '')
  const parsed = profileSlugFieldSchema.safeParse(raw)
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((e) => e.message).join(', ')
    return encodedRedirect('error', '/profile', errorMessage)
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return encodedRedirect('error', '/profile', 'Unable to verify identity')
  }

  const safeClient = createSafeClient()
  const { data: row, error: fetchError } = await safeClient.getUserByAuthId(
    user.id
  )

  if (fetchError || !row || typeof row !== 'object') {
    return encodedRedirect('error', '/profile', 'Could not load profile')
  }

  const profileRow = row as {
    profile_slug: string
    profile_slug_changed_at: string | null
  }

  if (parsed.data === profileRow.profile_slug) {
    return encodedRedirect(
      'success',
      '/profile',
      'Profile URL is already set to that value.'
    )
  }

  const { allowed, nextChangeAt } = getSlugChangeEligibility(
    profileRow.profile_slug_changed_at
  )
  if (!allowed && nextChangeAt) {
    const when = nextChangeAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return encodedRedirect(
      'error',
      '/profile',
      `You can change your profile URL again on ${when}.`
    )
  }

  const { data: conflict } = await supabase
    .from('users')
    .select('auth_user_id')
    .eq('profile_slug', parsed.data)
    .maybeSingle()

  if (conflict && 'auth_user_id' in conflict && conflict.auth_user_id !== user.id) {
    return encodedRedirect(
      'error',
      '/profile',
      'That profile URL is already taken.'
    )
  }

  const { error } = await safeClient.updateProfileSlug(user.id, parsed.data)

  if (error) {
    console.error('Profile slug update error:', error)
    return encodedRedirect(
      'error',
      '/profile',
      'Failed to update profile URL. It may already be taken.'
    )
  }

  console.info(
    JSON.stringify({
      event: 'profile.update_profile_slug',
      userId: user.id,
      ip,
      ts: new Date().toISOString(),
    })
  )
  return encodedRedirect(
    'success',
    '/profile',
    'Profile URL updated successfully.'
  )
}

export const signOutAction = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.auth.signOut()
  console.info(
    JSON.stringify({ event: 'auth.signout', email: user?.email, ts: new Date().toISOString() })
  )
  return redirect('/sign-in')
}
