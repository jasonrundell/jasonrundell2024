'use client'

import { forgotPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import Link from 'next/link'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { useState } from 'react'
import { CheckCircle, ArrowLeft } from 'lucide-react'

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

const BottomText = styled('p')`
  text-align: center;
  color: ${Tokens.colors.textSecondary.value};
  font-size: 1rem;
  margin-top: 1.5rem;
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${Tokens.colors.primary.value};
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`

const TryAgainButton = styled('button')`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid ${Tokens.colors.primary.value};
  color: ${Tokens.colors.primary.value};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${Tokens.colors.primary.value};
    color: white;
  }
`

const ButtonGroup = styled('div')`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage(null)

    const email = formData.get('email')?.toString() || ''
    setSubmittedEmail(email)

    try {
      // Since forgotPasswordAction either redirects or throws, we'll assume success
      // if no error is thrown. The action will handle redirects automatically.
      await forgotPasswordAction(formData)

      // If we reach here without an error, the action was successful
      setIsSubmitted(true)
    } catch (error) {
      // Handle any errors that might occur
      console.error('Password reset error:', error)
      setMessage({ error: 'Failed to send reset link. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We&apos;ve sent you a password reset link"
      >
        <SuccessContainer>
          <SuccessIcon />
          <SuccessTitle>Reset link sent!</SuccessTitle>
          <SuccessMessage>
            We&apos;ve sent a password reset link to{' '}
            <strong>{submittedEmail}</strong>.
            <br />
            Please check your inbox and follow the instructions to reset your password.
          </SuccessMessage>
          <ButtonGroup>
            <BackButton href="/sign-in">
              <ArrowLeft size={16} />
              Back to Sign In
            </BackButton>
            <TryAgainButton onClick={() => setIsSubmitted(false)}>
              Try Again
            </TryAgainButton>
          </ButtonGroup>
        </SuccessContainer>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <FormWrapper action={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </FieldGroup>
        <FullWidthButton
          formAction={handleSubmit}
          pendingText="Sending reset link..."
          disabled={isLoading}
        >
          Reset Password
        </FullWidthButton>

        {message && <FormMessage message={message} />}

        <BottomText>
          Remember your password?{' '}
          <Link href="/sign-in" className="link">
            Sign in
          </Link>
        </BottomText>
      </FormWrapper>
    </AuthLayout>
  )
}
