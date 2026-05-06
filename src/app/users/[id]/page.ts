import { createPublicClient } from '@/utils/supabase/public-client'
import { redirect, notFound } from 'next/navigation'
import { z } from 'zod'

const uuidSchema = z.string().uuid()

type LegacyUserPageProps = {
  params: Promise<{ id: string }>
}

type LegacyProfileRedirect = {
  profile_slug: string | null
}

export const revalidate = 300

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

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('public_user_profiles')
    .select('profile_slug')
    .eq('auth_user_id', id)
    .maybeSingle()
  const profile = data as LegacyProfileRedirect | null

  if (!profile?.profile_slug) {
    notFound()
  }

  redirect(`/u/${profile.profile_slug}`)
}
