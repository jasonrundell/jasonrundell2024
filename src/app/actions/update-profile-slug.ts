'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { rateLimit } from '@/lib/rate-limit'
import {
  profileSlugSchema as profileSlugFieldSchema,
  normalizeProfileSlug,
  getSlugChangeEligibility,
} from '@/lib/profile-slug'
import { AUTH_RATE_LIMITS, getClientIp } from './_shared'

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
    .from('public_user_profiles')
    .select('auth_user_id')
    .eq('profile_slug', parsed.data)
    .maybeSingle()

  if (
    conflict &&
    'auth_user_id' in conflict &&
    conflict.auth_user_id !== user.id
  ) {
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
