'use client'
import { Button } from '@/components/auth/ui/button'
import { Github, Mail } from 'lucide-react'

interface SocialAuthProps {
  onGoogleSignIn: () => void
  onGithubSignIn: () => void
}

export function SocialAuth({
  onGoogleSignIn,
  onGithubSignIn,
}: SocialAuthProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-text-secondary">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onGoogleSignIn}
          className="flex items-center justify-center gap-2"
        >
          <Mail className="h-4 w-4" />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={onGithubSignIn}
          className="flex items-center justify-center gap-2"
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  )
}
