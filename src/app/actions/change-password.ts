'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { getUnmetPasswordRequirementLabels } from '@/lib/password-validation'
import { AUTH_RATE_LIMITS, getClientIp } from './_shared'

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

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user?.email) {
    return encodedRedirect(
      'error',
      '/profile',
      'Unable to retrieve user information'
    )
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  })

  if (signInError) {
    return encodedRedirect('error', '/profile', 'Current password is incorrect')
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

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
