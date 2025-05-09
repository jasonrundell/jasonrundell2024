import { forgotPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/auth/form-message'
import { SubmitButton } from '@/components/auth/submit-button'
import { Input } from '@/components/auth/ui/input'
import { Label } from '@/components/auth/ui/label'
import Link from 'next/link'
import { SmtpMessage } from '../smtp-message'

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <>
      <form>
        <div>
          <h1>Reset Password</h1>
          <p>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  )
}
