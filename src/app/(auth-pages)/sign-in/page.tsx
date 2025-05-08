import { signInAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import { Checkbox } from '@/components/auth/ui/checkbox'
import { SocialAuthSection } from '@/components/auth/social-auth-section'
import { AuthLayout } from '@/components/auth/auth-layout'
import Link from 'next/link'

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-primary hover:underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>
        <div className="flex items-center gap-2 mt-2 mb-2">
          <Checkbox id="remember" name="remember" />
          <Label
            htmlFor="remember"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>
        <SubmitButton
          pendingText="Signing In..."
          formAction={signInAction}
          className="w-full h-12 rounded-lg text-lg font-bold mt-2 mb-2 shadow-sm"
        >
          Sign in
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
          Don't have an account?{' '}
          <Link
            className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 transition-colors"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
