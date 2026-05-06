'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Label } from '@/components/auth/ui/label'
import { Input } from '@/components/auth/ui/input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormMessage, Message } from '@/components/auth/form-message'
import { PasswordStrength } from '@/components/auth/password-strength'
import { changePasswordAction } from '@/app/actions'
import { isPasswordValid } from '@/lib/password-validation'
import Tokens from '@/lib/tokens'
import {
  SectionTitle,
  InfoCard,
  InfoCardHeader,
  InfoValue,
  StyledInfoLabel,
  ProfileForm,
  FormRow,
  PasswordInputWrapper,
  PasswordToggleButton,
  ButtonGroup,
  CancelButton,
  PasswordMatchIndicator,
  InfoBox,
  InfoBoxTitle,
  InfoBoxText,
} from './profile-styles'

export default function PasswordForm() {
  const [isChanging, setIsChanging] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const hasValidPasswordStrength = isPasswordValid(newPassword)
  const passwordsMatch = newPassword === confirmPassword
  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    hasValidPasswordStrength &&
    passwordsMatch

  const handleSubmit = async (formData: FormData) => {
    if (!isFormValid) {
      setMessage({
        error:
          'Please ensure all password requirements are met and passwords match.',
      })
      return
    }
    try {
      await changePasswordAction(formData)
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ error: 'Failed to change password. Please try again.' })
    }
  }

  const toggleForm = () => {
    setIsChanging(!isChanging)
    setMessage(null)
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
  }

  return (
    <>
      <SectionTitle>Security</SectionTitle>
      {!isChanging ? (
        <InfoCard>
          <InfoCardHeader>
            <Lock size={20} />
            <StyledInfoLabel>Password</StyledInfoLabel>
          </InfoCardHeader>
          <InfoValue>••••••••</InfoValue>
          <ButtonGroup>
            <SubmitButton onClick={toggleForm} variant="outline" size="sm">
              Change Password
            </SubmitButton>
          </ButtonGroup>
        </InfoCard>
      ) : (
        <ProfileForm action={handleSubmit}>
          <InfoBox>
            <InfoBoxTitle>Password Requirements</InfoBoxTitle>
            <InfoBoxText>
              Your new password must meet the following criteria: at least 8
              characters, one uppercase letter, one lowercase letter, one
              number, and one special character.
            </InfoBoxText>
          </InfoBox>

          <FormRow>
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInputWrapper>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                id="currentPassword"
                placeholder="Enter current password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordToggleButton
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword ? 'Hide password' : 'Show password'
                }
              >
                {showCurrentPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </PasswordToggleButton>
            </PasswordInputWrapper>
          </FormRow>

          <FormRow>
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInputWrapper>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                id="newPassword"
                placeholder="Enter new password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordToggleButton
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggleButton>
            </PasswordInputWrapper>
            {newPassword && <PasswordStrength password={newPassword} />}
          </FormRow>

          <FormRow>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInputWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </PasswordToggleButton>
            </PasswordInputWrapper>
            {confirmPassword && (
              <PasswordMatchIndicator
                style={{
                  color: passwordsMatch
                    ? Tokens.colors.roleSuccess.var
                    : Tokens.colors.roleDanger.var,
                }}
              >
                {passwordsMatch ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </PasswordMatchIndicator>
            )}
          </FormRow>

          {message && <FormMessage message={message} />}

          <ButtonGroup>
            <CancelButton type="button" onClick={toggleForm}>
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              pendingText="Changing password..."
              disabled={!isFormValid}
            >
              Change Password
            </SubmitButton>
          </ButtonGroup>
        </ProfileForm>
      )}
    </>
  )
}
