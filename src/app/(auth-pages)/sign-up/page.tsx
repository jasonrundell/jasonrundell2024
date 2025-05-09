import { signUpAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
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

export default async function Signup(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  if ('message' in searchParams) {
    return (
      <div>
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started">
      <FormWrapper>
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
