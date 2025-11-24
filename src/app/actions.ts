'use server'

import { z } from 'zod'
import { encodedRedirect } from '@/utils/utils'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Validation schemas
const emailSchema = z.string().email('Invalid email address')
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const signUpSchema = z.object({
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
  const rawData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }

  // Validate input
  const validationResult = signUpSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors
      .map((e) => e.message)
      .join(', ')
    return encodedRedirect('error', '/sign-up', errorMessage)
  }

  const { email, password } = validationResult.data
  const safeClient = createSafeClient()
  const origin = (await headers()).get('origin')

  const { error, isPaused, isAvailable } = await safeClient.execute(
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    return encodedRedirect('error', '/sign-up', errorMessage)
  } else {
    // Create a user record in the users table
    try {
      await safeClient.insertUser({
        email,
        full_name: email.split('@')[0], // Use email prefix as fallback name
        provider: 'email',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      console.log('User record created successfully for:', email)
    } catch (userError) {
      console.error('Failed to create user record:', userError)
      // Don't fail the signup if user record creation fails
      // The user can still sign in, and we'll create the record when they visit profile
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
  const rawData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }

  // Validate input
  const validationResult = signInSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors?.map((e) => e.message).join(', ') ||
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
    // Use generic error message for security (don't leak specific error details)
    console.error('Sign in error:', error)
    return redirect('/sign-in?error=auth_error')
  }

  return redirect('/profile')
}

export const forgotPasswordAction = async (formData: FormData) => {
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

    // Sign out the user after successful password reset
    await supabase.auth.signOut()

    // Success - redirect to sign in page with success message
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

  // Validate password strength requirements
  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  }

  const unmetRequirements = Object.entries(passwordRequirements)
    .filter(([, met]) => !met)
    .map(([requirement]) => {
      switch (requirement) {
        case 'length':
          return 'at least 8 characters'
        case 'uppercase':
          return 'at least one uppercase letter'
        case 'lowercase':
          return 'at least one lowercase letter'
        case 'number':
          return 'at least one number'
        case 'special':
          return 'at least one special character'
        default:
          return requirement
      }
    })

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

  return encodedRedirect('success', '/profile', 'Password changed successfully')
}

export const signOutAction = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/sign-in')
}
