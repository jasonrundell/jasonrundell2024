import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot password | Jason Rundell',
  description: 'Request a password reset link.',
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
