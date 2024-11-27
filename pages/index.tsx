import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home = () => {
  const router = useRouter()

  const handleGuestSignIn = () => {
    router.push('/chat')
  }

  return (
    <div>
      <h1>Welcome to Character Chat</h1>
      <button onClick={handleGuestSignIn}>Sign in as Guest</button>
      <Link href="/signIn">Sign in with OAuth</Link>
    </div>
  )
}

export default Home
