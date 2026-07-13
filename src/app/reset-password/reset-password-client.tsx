'use client'

import { resetPasswordAction } from '@/app/actions'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useState } from 'react'
import Tokens from '@/lib/tokens'

export default function ResetPasswordClient({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      formData.append('token', token)

      await resetPasswordAction(formData)

      window.location.href = '/sign-in?message=password_reset_success'
    } catch (err) {
      console.error('Password reset error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. Please try again.'
      )
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Please enter your new password below"
    >
      {error && (
        <div
          role="alert"
          style={{
            color: '#b91c1c',
            borderLeft: '2px solid #b91c1c',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            marginBottom: '0.5rem',
          }}
        >
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        {/* Hidden input to pass the token to the server action */}
        <input type="hidden" name="token" value={token} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="New password"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '0.5rem',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '0.5rem',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: Tokens.colors.link.var,
            color: 'white',
            border: 'none',
            borderRadius: `${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit}`,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  )
}
