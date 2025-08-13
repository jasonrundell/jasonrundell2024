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
      return encodedRedirect(
        'error',
        '/sign-in',
        'Database is currently paused. Please resume your Supabase project to continue.'
      )
    }
    return encodedRedirect(
      'error',
      '/sign-in',
      'Database is unavailable. Please try again later.'
    )
  }

  if (error) {
    return encodedRedirect('error', '/sign-in', error)
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
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
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

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/reset-password',
      'Password and confirm password are required'
    )
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/reset-password',
      'Passwords do not match'
    )
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    encodedRedirect(
      'error',
      '/reset-password',
      'Password update failed'
    )
  }

  encodedRedirect('success', '/reset-password', 'Password updated')
}

export const signOutAction = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/sign-in')
}
