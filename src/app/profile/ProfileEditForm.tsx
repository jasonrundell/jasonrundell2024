'use client'

import { useState } from 'react'
import { User } from 'lucide-react'
import { Label } from '@/components/auth/ui/label'
import { Input } from '@/components/auth/ui/input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormMessage, Message } from '@/components/auth/form-message'
import { updateDisplayNameAction } from '@/app/actions'
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
  CancelButton,
} from './profile-styles'

interface ProfileEditFormProps {
  displayName: string
}

export default function ProfileEditForm({ displayName }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(displayName)
  const [nameMessage, setNameMessage] = useState<Message | null>(null)

  return (
    <AccountInfoSection>
      <SectionTitle>Display Name</SectionTitle>
      {!isEditing ? (
        <InfoCard>
          <InfoCardHeader>
            <User size={20} />
            <StyledInfoLabel>Public Display Name</StyledInfoLabel>
          </InfoCardHeader>
          <InfoValue>{displayName}</InfoValue>
          <ButtonGroup>
            <SubmitButton
              onClick={() => {
                setIsEditing(true)
                setEditedName(displayName)
                setNameMessage(null)
              }}
              variant="outline"
              size="sm"
            >
              Edit
            </SubmitButton>
          </ButtonGroup>
        </InfoCard>
      ) : (
        <ProfileForm
          action={async (formData: FormData) => {
            const name = formData.get('displayName')?.toString()?.trim()
            if (!name || name.length < 2 || name.length > 50) {
              setNameMessage({
                error: 'Display name must be between 2 and 50 characters.',
              })
              return
            }
            try {
              await updateDisplayNameAction(formData)
            } catch (err) {
              console.error('Display name update error:', err)
              setNameMessage({
                error: 'Failed to update display name. Please try again.',
              })
            }
          }}
        >
          <FormRow>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              type="text"
              name="displayName"
              id="displayName"
              placeholder="Your public display name"
              required
              minLength={2}
              maxLength={50}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </FormRow>
          {nameMessage && <FormMessage message={nameMessage} />}
          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={() => {
                setIsEditing(false)
                setNameMessage(null)
              }}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              pendingText="Saving..."
              disabled={
                !editedName.trim() ||
                editedName.trim().length < 2 ||
                editedName.trim().length > 50
              }
            >
              Save
            </SubmitButton>
          </ButtonGroup>
        </ProfileForm>
      )}
    </AccountInfoSection>
  )
}
