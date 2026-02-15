'use client'

import { Label } from '@/components/auth/ui/label'
import { Input } from '@/components/auth/ui/input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormMessage, Message } from '@/components/auth/form-message'
import { PasswordStrength } from '@/components/auth/password-strength'
import { changePasswordAction } from '@/app/actions'
import {
  Calendar,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { styled } from '@pigment-css/react'
import { useState } from 'react'
import Tokens from '@/lib/tokens'
import { isPasswordValid } from '@/lib/password-validation'

// Styled components using Pigment-CSS
const ProfileContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`

const UserInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${Tokens.colors.primary.value}15,
    ${Tokens.colors.primary.value}05
  );
  border-radius: 1rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
`

const UserAvatar = styled('div')`
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  background: ${Tokens.colors.primary.value};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 4px solid ${Tokens.colors.backgroundDarker.value};
  box-shadow: 0 4px 20px ${Tokens.colors.primary.value}4D;
`

const UserName = styled('h2')`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.textPrimary.value};
`

const UserEmail = styled('p')`
  font-size: 1rem;
  margin: 0;
  color: ${Tokens.colors.textSecondary.value};
  opacity: 0.8;
`

const AccountInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const SectionTitle = styled('h3')`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.textPrimary.value};
  text-align: center;
`

const InfoGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

const InfoCard = styled('div')`
  background: ${Tokens.colors.backgroundDarker.value};
  border-radius: ${Tokens.borderRadius.large.value}${Tokens.borderRadius.large.unit};
  padding: 1.25rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.primary.value}40;
    transform: translateY(-2px);
  }
`

const InfoCardHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${Tokens.colors.primary.value};
`

const InfoValue = styled('div')`
  font-size: 1rem;
  font-weight: 500;
  color: ${Tokens.colors.textPrimary.value};
  padding: 0.5rem 0;
`

const StyledInfoLabel = styled(Label)`
  color: ${Tokens.colors.primary.value} !important;
  margin: 0 !important;
`

const StyledInfoValueCapitalize = styled(InfoValue)`
  text-transform: capitalize;
`

const ChangePasswordSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ChangePasswordForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${Tokens.colors.backgroundDarker.value};
  border-radius: ${Tokens.borderRadius.large.value}${Tokens.borderRadius.large.unit};
  padding: 1.5rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
`

const FormRow = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PasswordInputWrapper = styled('div')`
  position: relative;
`

const PasswordToggleButton = styled('button')`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${Tokens.colors.textSecondary.value};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${Tokens.colors.primary.value};
  }
`

const ButtonGroup = styled('div')`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

const CancelButton = styled('button')`
  background: none;
  border: 1px solid ${Tokens.colors.textSecondary.value};
  color: ${Tokens.colors.textSecondary.value};
  padding: 0.75rem 1.5rem;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.textPrimary.value};
    color: ${Tokens.colors.textPrimary.value};
  }
`

const PasswordMatchIndicator = styled('div')`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const PasswordRequirementsInfo = styled('div')`
  background: ${Tokens.colors.primary.value}10;
  border: 1px solid ${Tokens.colors.primary.value}30;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  padding: 1rem;
  margin-bottom: 1rem;
`

const RequirementsTitle = styled('h4')`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${Tokens.colors.primary.value};
`

const RequirementsText = styled('p')`
  font-size: 0.875rem;
  margin: 0;
  color: ${Tokens.colors.textSecondary.value};
  line-height: 1.4;
`

interface ProfileClientProps {
  user: {
    email: string
    app_metadata?: {
      provider?: string
    }
  }
  userData?: {
    full_name?: string
    created_at?: string
  }
  signOutAction: () => void
}

export default function ProfileClient({ user, userData }: ProfileClientProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const displayName = userData?.full_name || user.email?.split('@')[0] || 'User'
  const email = user.email || 'No email provided'
  const accountCreated = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'
  const authMethod = user.app_metadata?.provider || 'email'

  const hasValidPasswordStrength = isPasswordValid(newPassword)
  const passwordsMatch = newPassword === confirmPassword
  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    hasValidPasswordStrength &&
    passwordsMatch

  const handleChangePassword = async (formData: FormData) => {
    if (!isFormValid) {
      setMessage({
        error:
          'Please ensure all password requirements are met and passwords match.',
      })
      return
    }

    try {
      await changePasswordAction(formData)
      // If successful, the action will redirect with a success message
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ error: 'Failed to change password. Please try again.' })
    }
  }

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword)
    setMessage(null)
    // Reset form state when toggling
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
  }

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'currentPassword':
        setCurrentPassword(value)
        break
      case 'newPassword':
        setNewPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
  }

  // Debug logging
  // console.log('ProfileClient render:', {
  //   user,
  //   userData,
  //   displayName,
  //   fullName,
  //   accountCreated,
  //   authMethod
  // });

  return (
    <ProfileContainer>
      <UserInfoSection>
        <UserAvatar>{displayName.charAt(0).toUpperCase()}</UserAvatar>
        <div>
          <UserName>Welcome, {displayName}</UserName>
          <UserEmail>{email}</UserEmail>
        </div>
      </UserInfoSection>

      <AccountInfoSection>
        <SectionTitle>Account Information</SectionTitle>

        <InfoGrid>
          <InfoCard>
            <InfoCardHeader>
              <Mail size={20} />
              <StyledInfoLabel>Email Address</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>{email}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Calendar size={20} />
              <StyledInfoLabel>Account Created</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>{accountCreated}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Shield size={20} />
              <StyledInfoLabel>Authentication Method</StyledInfoLabel>
            </InfoCardHeader>
            <StyledInfoValueCapitalize>
              {authMethod}
            </StyledInfoValueCapitalize>
          </InfoCard>
        </InfoGrid>
      </AccountInfoSection>

      <ChangePasswordSection>
        <SectionTitle>Security</SectionTitle>

        {!isChangingPassword ? (
          <InfoCard>
            <InfoCardHeader>
              <Lock size={20} />
              <StyledInfoLabel>Password</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>••••••••</InfoValue>
            <ButtonGroup>
              <SubmitButton
                onClick={toggleChangePassword}
                variant="outline"
                size="sm"
              >
                Change Password
              </SubmitButton>
            </ButtonGroup>
          </InfoCard>
        ) : (
          <ChangePasswordForm action={handleChangePassword}>
            <PasswordRequirementsInfo>
              <RequirementsTitle>Password Requirements</RequirementsTitle>
              <RequirementsText>
                Your new password must meet the following criteria: at least 8
                characters, one uppercase letter, one lowercase letter, one
                number, and one special character.
              </RequirementsText>
            </PasswordRequirementsInfo>

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
                  onChange={(e) =>
                    handleInputChange('currentPassword', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange('newPassword', e.target.value)
                  }
                />
                <PasswordToggleButton
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
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
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
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
                      ? Tokens.colors.success.value
                      : Tokens.colors.error.value,
                  }}
                >
                  {passwordsMatch ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </PasswordMatchIndicator>
              )}
            </FormRow>

            {message && <FormMessage message={message} />}

            <ButtonGroup>
              <CancelButton type="button" onClick={toggleChangePassword}>
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
          </ChangePasswordForm>
        )}
      </ChangePasswordSection>
    </ProfileContainer>
  )
}
