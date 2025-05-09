import { signInAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { Checkbox } from '@/components/auth/ui/checkbox'
import { SocialAuthSection } from '@/components/auth/social-auth-section'
import { AuthLayout } from '@/components/auth/auth-layout'
import Link from 'next/link'
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

const RememberGroup = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </FieldGroup>
        <RememberGroup>
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </RememberGroup>
        <FullWidthButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </FullWidthButton>
        <Divider>
          <div className="line" />
          <span>or continue with</span>
          <div className="line" />
        </Divider>
        <SocialAuthSection />
        <BottomText>
          Don't have an account? <Link href="/sign-up">Sign up</Link>
        </BottomText>
      </FormWrapper>
    </AuthLayout>
  )
}
