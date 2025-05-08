'use client'
import { SocialAuth } from './social-auth'

export function SocialAuthSection() {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    alert('Google sign-in not implemented')
  }
  const handleGithubSignIn = () => {
    // TODO: Implement GitHub sign-in
    alert('GitHub sign-in not implemented')
  }

  return (
    <SocialAuth
      onGoogleSignIn={handleGoogleSignIn}
      onGithubSignIn={handleGithubSignIn}
    />
  )
}
