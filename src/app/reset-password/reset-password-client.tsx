'use client'

import { resetPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import { styled } from '@pigment-css/react'
import { useState } from 'react'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Tokens from '@/lib/tokens'

const FormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const FieldGroup = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`

const FullWidthButton = styled(SubmitButton)`
  width: 100%;
`

const SuccessContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  width: 100%;
`

const SuccessIcon = styled(CheckCircle)`
  color: ${Tokens.colors.success.value};
  width: 4rem;
  height: 4rem;
`

const SuccessTitle = styled('h2')`
  color: ${Tokens.colors.textPrimary.value};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const SuccessMessage = styled('p')`
  color: ${Tokens.colors.textSecondary.value};
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
`

const ButtonGroup = styled('div')`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid ${Tokens.colors.primary.value};
  color: ${Tokens.colors.primary.value};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${Tokens.colors.primary.value};
    color: white;
  }
`

export default function ResetPasswordClient() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Since resetPasswordAction either redirects or throws, we'll assume success
      // if no error is thrown. The action will handle redirects automatically.
      await resetPasswordAction(formData)

      // If we reach here without an error, the action was successful
      setIsSubmitted(true)
    } catch (error) {
      // Handle any errors that might occur
      console.error('Password reset error:', error)
      setMessage({ error: 'Failed to reset password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Password Reset Complete"
        subtitle="Your password has been successfully updated"
      >
        <SuccessContainer>
          <SuccessIcon />
          <SuccessTitle>Password updated successfully!</SuccessTitle>
          <SuccessMessage>
            Your password has been reset. You can now sign in with your new password.
          </SuccessMessage>
          <ButtonGroup>
            <SecondaryButton href="/sign-in">
              <ArrowLeft size={16} />
              Sign In
            </SecondaryButton>
          </ButtonGroup>
        </SuccessContainer>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Please enter your new password below"
    >
      <FormWrapper>
        <FieldGroup>
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
            disabled={isLoading}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            disabled={isLoading}
          />
        </FieldGroup>
        <FullWidthButton
          formAction={handleSubmit}
          pendingText="Resetting password..."
          disabled={isLoading}
        >
          Reset password
        </FullWidthButton>

        {message && <FormMessage message={message} />}
      </FormWrapper>
    </AuthLayout>
  )
}
