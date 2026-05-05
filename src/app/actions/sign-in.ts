'use server'

import { createSafeClient } from '@/utils/supabase/safe-client'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { AUTH_RATE_LIMITS, getClientIp, signInSchema } from './_shared'

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

  const validationResult = signInSchema.safeParse(rawData)
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues.map((e) => e.message).join(', ') ||
      'Validation failed'
    return redirect(
      `/sign-in?error=validation_error&message=${encodeURIComponent(errorMessage)}`
    )
  }

  const { email, password } = validationResult.data
  const safeClient = createSafeClient()

  const { error, isPaused, isAvailable } = await safeClient.execute(
    async () => {
      const supabase = await import('@/utils/supabase/server').then((m) =>
        m.createClient()
      )
      const result = await supabase.auth.signInWithPassword({ email, password })
      return { data: result.data, error: result.error }
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
    JSON.stringify({
      event: 'auth.signin',
      email,
      ip,
      ts: new Date().toISOString(),
    })
  )
  return redirect('/profile')
}
