'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import { Label } from '@/components/auth/ui/label'
import { Input } from '@/components/auth/ui/input'
import { SubmitButton } from '@/components/auth/submit-button'
import { updateProfileSlugAction } from '@/app/actions'
import {
  AccountInfoSection,
  SectionTitle,
  InfoCard,
  InfoCardHeader,
  InfoValue,
  StyledInfoLabel,
  ProfileForm,
  FormRow,
  ButtonGroup,
  InfoBox,
  InfoBoxTitle,
  InfoBoxText,
} from './profile-styles'

interface SlugFormProps {
  profileSlug?: string
  canChange: boolean
  nextChangeAt?: Date | null
}

export default function SlugForm({
  profileSlug,
  canChange,
  nextChangeAt,
}: SlugFormProps) {
  return (
    <AccountInfoSection>
      <SectionTitle>Profile URL</SectionTitle>
      <InfoBox>
        <InfoBoxTitle>Public profile link</InfoBoxTitle>
        <InfoBoxText>
          3–30 characters: lowercase letters, numbers, and hyphens only. You can
          change this at most once every 90 days.
        </InfoBoxText>
      </InfoBox>
      {profileSlug ? (
        <>
          <InfoCard>
            <InfoCardHeader>
              <User size={20} />
              <StyledInfoLabel>Current link</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>
              <Link href={`/u/${profileSlug}`} style={{ color: 'inherit' }}>
                /u/{profileSlug}
              </Link>
            </InfoValue>
          </InfoCard>
          <ProfileForm action={updateProfileSlugAction}>
            <FormRow>
              <Label htmlFor="profileSlug">Profile URL slug</Label>
              <Input
                type="text"
                name="profileSlug"
                id="profileSlug"
                defaultValue={profileSlug}
                disabled={!canChange}
                minLength={3}
                maxLength={30}
                autoComplete="off"
              />
            </FormRow>
            {!canChange && nextChangeAt && (
              <InfoBoxText>
                Next change available on{' '}
                {nextChangeAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                .
              </InfoBoxText>
            )}
            <ButtonGroup>
              <SubmitButton
                type="submit"
                pendingText="Saving..."
                disabled={!canChange}
              >
                Save profile URL
              </SubmitButton>
            </ButtonGroup>
          </ProfileForm>
        </>
      ) : (
        <InfoBoxText>
          Your profile URL is not available yet. Refresh the page or contact
          support if this persists.
        </InfoBoxText>
      )}
    </AccountInfoSection>
  )
}
