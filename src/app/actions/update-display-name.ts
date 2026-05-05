'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { rateLimit } from '@/lib/rate-limit'
import { AUTH_RATE_LIMITS, getClientIp, displayNameSchema } from './_shared'

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
  const { error } = await safeClient.updateDisplayName(user.id, parseResult.data)

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
