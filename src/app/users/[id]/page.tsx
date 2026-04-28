import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { z } from 'zod'

const uuidSchema = z.string().uuid()

type LegacyUserPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Legacy UUID profile URLs redirect to /u/[profile_slug].
 */
export default async function LegacyUserProfileRedirect({
  params,
}: LegacyUserPageProps) {
  const { id } = await params

  if (!uuidSchema.safeParse(id).success) {
    notFound()
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('public_user_profiles')
    .select('profile_slug')
    .eq('auth_user_id', id)
    .maybeSingle()

  if (!profile?.profile_slug) {
    notFound()
  }

  redirect(`/u/${profile.profile_slug}`)
}
