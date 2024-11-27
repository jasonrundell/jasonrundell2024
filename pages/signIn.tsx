import { getProviders, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

interface SignInProps {
  providers: Record<string, any> | null
}

const SignIn = ({ providers }: SignInProps) => {
  const router = useRouter()

  return (
    <div>
      <h1>Sign In</h1>
      <p>Sign in with your account or continue as a guest.</p>

      {providers ? (
        Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))
      ) : (
        <p>No providers available</p>
      )}

      <button onClick={() => router.push('/')}>Continue as Guest</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: { providers: providers || null },
  }
}

export default SignIn
