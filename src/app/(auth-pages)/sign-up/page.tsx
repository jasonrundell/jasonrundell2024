import type { Metadata } from 'next'
import SignUpClient from './sign-up-client'

export const metadata: Metadata = {
  title: 'Sign up | Jason Rundell',
  description: 'Create a Jason Rundell account.',
}

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams

  return <SignUpClient success={params?.success} error={params?.error} />
}
