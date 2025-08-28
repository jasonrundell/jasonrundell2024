'use client'

import { resetPasswordAction } from '@/app/actions'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useState } from 'react'

export default function ResetPasswordClient({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      formData.append('token', token)

      // Call the server action directly
      await resetPasswordAction(formData)

      // If we reach here, the action completed successfully
      // The server action should have redirected, but if not, we'll redirect manually
      window.location.href = '/sign-in?message=password_reset_success'
    } catch (error) {
      console.error('Password reset error:', error)
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Please enter your new password below"
    >
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
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
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
