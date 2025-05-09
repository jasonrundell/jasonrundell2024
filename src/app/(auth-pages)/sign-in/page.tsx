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
      <form>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </div>
        <div>
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <div>
          <div />
          <span>or continue with</span>
          <div />
        </div>
        <SocialAuthSection />
        <p>
          Don't have an account? <Link href="/sign-up">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
