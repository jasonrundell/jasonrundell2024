import { signUpAction } from '@/app/actions'
import { FormMessage } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { SocialAuthSection } from '@/components/auth/social-auth-section'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordInput } from '@/components/auth/password-input'
import Link from 'next/link'
import { SmtpMessage } from '../smtp-message'
import { styled } from '@pigment-css/react'
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

const Divider = styled('div')`
  display: flex;
  align-items: center;
  margin: 1.5rem 0 1rem 0;
  color: ${Tokens.colors.textSecondary.value};
  font-size: 0.95rem;
  gap: 1rem;
  width: 100%;

  & > .line {
    flex: 1;
    height: 1px;
    background: ${Tokens.colors.border.value};
    border: none;
  }
`

const BottomText = styled('p')`
  text-align: center;
  color: ${Tokens.colors.textSecondary.value};
  font-size: 1rem;
  margin-top: 1.5rem;
`

const SmtpWrapper = styled('div')`
  margin-top: 2rem;
`

const SuccessWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem 0;
`

const SuccessIcon = styled('div')`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${Tokens.colors.primary.value};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`

const SuccessTitle = styled('h1')`
  color: ${Tokens.colors.secondary.value};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const SuccessMessage = styled('p')`
  color: ${Tokens.colors.textSecondary.value};
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  max-width: 400px;
`

const ActionButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: ${Tokens.colors.primary.value};
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${Tokens.colors.primaryHover?.value ||
    Tokens.colors.primary.value};
  }
`

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams

  // Check if we have a success message from query parameters
  if (params && params.success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a verification link"
      >
        <SuccessWrapper>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>Account created successfully!</SuccessTitle>
          <SuccessMessage>
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </SuccessMessage>
          <ActionButton href="/sign-in">Back to Sign In</ActionButton>
        </SuccessWrapper>
      </AuthLayout>
    )
  }

  // Check if we have an error message
  if (params && params.error) {
    return (
      <AuthLayout title="Create an account" subtitle="Sign up to get started">
        <FormWrapper action={signUpAction}>
          <FormMessage message={{ error: params.error }} />
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              name="password"
              placeholder="Create a password"
              required
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              minLength={8}
              required
            />
          </FieldGroup>
          <FullWidthButton
            formAction={signUpAction}
            pendingText="Signing up..."
          >
            Sign up
          </FullWidthButton>
          <Divider>
            <div className="line" />
            <span>or continue with</span>
            <div className="line" />
          </Divider>
          <SocialAuthSection />
          <BottomText>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </BottomText>
          <SmtpWrapper>
            <SmtpMessage />
          </SmtpWrapper>
        </FormWrapper>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started">
      <FormWrapper action={signUpAction}>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            name="password"
            placeholder="Create a password"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            minLength={8}
            required
          />
        </FieldGroup>
        <FullWidthButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </FullWidthButton>
        <Divider>
          <div className="line" />
          <span>or continue with</span>
          <div className="line" />
        </Divider>
        <SocialAuthSection />
        <BottomText>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </BottomText>
        <SmtpWrapper>
          <SmtpMessage />
        </SmtpWrapper>
      </FormWrapper>
    </AuthLayout>
  )
}
