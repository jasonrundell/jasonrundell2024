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

export default async function Signup(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started">
      <form className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            name="password"
            placeholder="Create a password"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            minLength={8}
            required
          />
        </div>
        <SubmitButton
          formAction={signUpAction}
          pendingText="Signing up..."
          className="w-full h-12 rounded-lg text-lg font-bold mt-2 mb-2 shadow-sm"
        >
          Sign up
        </SubmitButton>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-border" />
          <span className="mx-4 text-text-secondary text-sm">
            or continue with
          </span>
          <div className="flex-grow border-t border-border" />
        </div>
        <SocialAuthSection />
        <p className="text-sm text-center text-text-secondary mt-4">
          Already have an account?{' '}
          <Link
            className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 transition-colors"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </form>
      <SmtpMessage />
    </AuthLayout>
  )
}
