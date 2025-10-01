import SignUpClient from './sign-up-client'

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams

  return <SignUpClient success={params?.success} error={params?.error} />
}
