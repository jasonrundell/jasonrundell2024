'use client'

import { Label } from '@/components/auth/ui/label'
import { Input } from '@/components/auth/ui/input'
import { SubmitButton } from '@/components/auth/submit-button'
import { FormMessage, Message } from '@/components/auth/form-message'
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
import { useState, useEffect } from 'react'
import Tokens from '@/lib/tokens'

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
  box-shadow: 0 4px 20px rgba(233, 190, 98, 0.3);
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
  border-radius: 0.75rem;
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
  border-radius: 0.75rem;
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
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.textPrimary.value};
    color: ${Tokens.colors.textPrimary.value};
  }
`

const StyledPasswordStrength = styled('div')`
  margin-top: 0.75rem;
`

const StrengthBar = styled('div')`
  height: 0.25rem;
  background: ${Tokens.colors.backgroundDarker.value};
  border-radius: 0.125rem;
  margin-bottom: 1rem;
  overflow: hidden;
`

const StrengthFill = styled('div')`
  height: 100%;
  transition: all 0.3s ease;
`

const RequirementsList = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: ${Tokens.colors.textSecondary.value};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const RequirementItem = styled('li')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const RequirementText = styled('span')`
  font-size: 0.875rem;
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
  border-radius: 0.5rem;
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

  // Password strength validation
  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = newPassword === confirmPassword
  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    isPasswordValid &&
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
                      : '#ef4444',
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

// Custom PasswordStrength component that matches the design system
function PasswordStrength({ password }: { password: string }) {
  const [strength, setStrength] = useState(0)
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setRequirements(newRequirements)

    const metRequirements =
      Object.values(newRequirements).filter(Boolean).length
    const newStrength = (metRequirements / 5) * 100
    setStrength(newStrength)
  }, [password])

  return (
    <StyledPasswordStrength>
      <StrengthBar>
        <StrengthFill
          style={{
            width: `${strength}%`,
            background:
              strength < 33
                ? Tokens.colors.warning?.value || '#f59e0b'
                : strength < 66
                ? Tokens.colors.accent?.value || '#3b82f6'
                : Tokens.colors.success.value,
          }}
        />
      </StrengthBar>
      <RequirementsList>
        <RequirementItem>
          {requirements.length ? (
            <CheckCircle size={16} color={Tokens.colors.success.value} />
          ) : (
            <XCircle
              size={16}
              color={Tokens.colors.warning?.value || '#f59e0b'}
            />
          )}
          <RequirementText>At least 8 characters</RequirementText>
        </RequirementItem>
        <RequirementItem>
          {requirements.uppercase ? (
            <CheckCircle size={16} color={Tokens.colors.success.value} />
          ) : (
            <XCircle
              size={16}
              color={Tokens.colors.warning?.value || '#f59e0b'}
            />
          )}
          <RequirementText>At least one uppercase letter</RequirementText>
        </RequirementItem>
        <RequirementItem>
          {requirements.lowercase ? (
            <CheckCircle size={16} color={Tokens.colors.success.value} />
          ) : (
            <XCircle
              size={16}
              color={Tokens.colors.warning?.value || '#f59e0b'}
            />
          )}
          <RequirementText>At least one lowercase letter</RequirementText>
        </RequirementItem>
        <RequirementItem>
          {requirements.number ? (
            <CheckCircle size={16} color={Tokens.colors.success.value} />
          ) : (
            <XCircle
              size={16}
              color={Tokens.colors.warning?.value || '#f59e0b'}
            />
          )}
          <RequirementText>At least one number</RequirementText>
        </RequirementItem>
        <RequirementItem>
          {requirements.special ? (
            <CheckCircle size={16} color={Tokens.colors.success.value} />
          ) : (
            <XCircle
              size={16}
              color={Tokens.colors.warning?.value || '#f59e0b'}
            />
          )}
          <RequirementText>At least one special character</RequirementText>
        </RequirementItem>
      </RequirementsList>
    </StyledPasswordStrength>
  )
}
