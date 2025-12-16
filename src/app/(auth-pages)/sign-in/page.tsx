import { signInAction } from '@/app/actions'
import { FormMessage } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { Checkbox } from '@/components/auth/ui/checkbox'
import { AuthLayout } from '@/components/auth/auth-layout'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { StyledLink } from '@/styles/common'

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

const RememberGroup = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const errorMessages: Record<string, string> = {
  not_authenticated: 'Please sign in to access this page',
  user_not_found: 'User account not found. Please sign up first.',
  auth_session: 'Error creating authentication session',
  no_auth_url: 'Authentication URL not available',
  server_error: 'An error occurred. Please try again.',
  invalid_code: 'Invalid authentication code',
  supabase_paused:
    'Database is currently paused. Please resume your Supabase project to continue.',
  supabase_unavailable: 'Database is unavailable. Please try again later.',
  invalid_credentials: 'Invalid email or password. Please try again.',
  email_not_confirmed: 'Please confirm your email address before signing in.',
  auth_error: 'Authentication failed. Please try again.',
}

const successMessages: Record<string, string> = {
  password_reset_success:
    'Your password has been successfully reset. You can now sign in with your new password.',
  email_confirmed: 'Email confirmed successfully. Please sign in.',
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    message?: string
    redirectedFrom?: string
  }>
}) {
  const params = await searchParams
  const errorCode = params?.error
  const customMessage = params?.message
  const redirectedFrom = params?.redirectedFrom

  // Construct the error or success message
  let message = customMessage
  if (errorCode && !customMessage) {
    message = errorMessages[errorCode] || 'An unknown error occurred'
  } else if (customMessage && successMessages[customMessage]) {
    message = successMessages[customMessage]
  }

  // If we have an error, log it
  if (errorCode) {
    console.error('Auth error:', { errorCode, message, redirectedFrom })
  }

  // Convert message to Message type for FormMessage
  const formMessage = message
    ? errorCode
      ? { error: message }
      : { message }
    : undefined

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <FormWrapper action={signInAction}>
        {formMessage ? (
          <FormMessage message={formMessage} />
        ) : params?.message ? (
          <FormMessage message={{ message: String(params.message) }} />
        ) : null}
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            data-sentry-mask
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
            <StyledLink href="/forgot-password">
              Forgot Password?
            </StyledLink>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
            data-sentry-mask
          />
        </FieldGroup>
        <RememberGroup>
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </RememberGroup>
        <FullWidthButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </FullWidthButton>
        <BottomText>
          Don&apos;t have an account?{' '}
          <StyledLink href="/sign-up">
            Sign up
          </StyledLink>
        </BottomText>
      </FormWrapper>
    </AuthLayout>
  )
}
