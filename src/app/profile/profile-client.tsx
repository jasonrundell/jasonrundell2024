'use client'

import { getSlugChangeEligibility } from '@/lib/profile-slug'
import { ProfileContainer } from './profile-styles'
import ProfileSummary from './ProfileSummary'
import ProfileEditForm from './ProfileEditForm'
import SlugForm from './SlugForm'
import PasswordForm from './PasswordForm'

interface ProfileClientProps {
  user: {
    email: string
    id: string
    app_metadata?: {
      provider?: string
    }
  }
  userData?: {
    full_name?: string
    created_at?: string
    profile_slug?: string
    profile_slug_changed_at?: string | null
  }
  signOutAction: () => void
}

export default function ProfileClient({ user, userData }: ProfileClientProps) {
  const displayName =
    userData?.full_name || user.email?.split('@')[0] || 'User'
  const email = user.email
  const accountCreated = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'
  const authMethod = user.app_metadata?.provider || 'email'

  const { allowed: canChangeProfileSlug, nextChangeAt } =
    getSlugChangeEligibility(userData?.profile_slug_changed_at ?? null)

  return (
    <ProfileContainer>
      <ProfileSummary
        displayName={displayName}
        email={email}
        accountCreated={accountCreated}
        authMethod={authMethod}
      />
      <ProfileEditForm displayName={displayName} />
      <SlugForm
        profileSlug={userData?.profile_slug}
        canChange={canChangeProfileSlug}
        nextChangeAt={nextChangeAt}
      />
      <PasswordForm />
    </ProfileContainer>
  )
}
