'use client'
import { SocialAuth } from './social-auth'

export function SocialAuthSection() {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    alert('Google sign-in not implemented')
  }

  // The actual GitHub sign-in implementation is in the SocialAuth component
  const handleGithubSignIn = () => {
    // This is a no-op since the actual implementation is in the SocialAuth component
  }

  return (
    <SocialAuth
      onGoogleSignIn={handleGoogleSignIn}
      onGithubSignIn={handleGithubSignIn}
    />
  )
}
