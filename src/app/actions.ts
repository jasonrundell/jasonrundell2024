'use server'

import { encodedRedirect } from '@/utils/utils'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const safeClient = createSafeClient()
  const origin = (await headers()).get('origin')

  if (!email || !password) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Email and password are required'
    )
  }

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
    return encodedRedirect('error', '/sign-up', error)
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

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
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
    // Handle specific authentication errors
    let errorCode = 'auth_error'
    if (error.includes('Invalid login credentials')) {
      errorCode = 'invalid_credentials'
    } else if (error.includes('Email not confirmed')) {
      errorCode = 'email_not_confirmed'
    }

    return redirect(`/sign-in?error=${errorCode}`)
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

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: (await supabase.auth.getUser()).data.user?.email || '',
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
