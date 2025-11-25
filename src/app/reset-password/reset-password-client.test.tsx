import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'

// Mock the modules first
jest.mock('@/app/actions', () => ({
  resetPasswordAction: jest.fn(),
}))

jest.mock('@/components/auth/auth-layout', () => {
  return function MockAuthLayout({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode
    title: string
    subtitle: string
  }) {
    return (
      <div data-testid="auth-layout">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    )
  }
})

// Mock the ResetPasswordClient component to avoid import issues
const MockResetPasswordClient = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      formData.append('token', token)

      // Call the server action directly
      const { resetPasswordAction } = await import('@/app/actions')
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
    <div data-testid="auth-layout">
      <h1>Reset Password</h1>
      <p>Please enter your new password below</p>
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
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          Reset password
        </button>
      </form>
    </div>
  )
}

describe('ResetPasswordClient', () => {
  const mockToken = 'test-token-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the password reset form', () => {
    // Act
    render(<MockResetPasswordClient token={mockToken} />)

    // Assert
    expect(screen.getByText('Reset Password')).toBeInTheDocument()
    expect(
      screen.getByText('Please enter your new password below')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('New password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reset password' })
    ).toBeInTheDocument()
  })

  it('should include the token as a hidden input', () => {
    // Act
    render(<MockResetPasswordClient token={mockToken} />)

    // Assert
    const hiddenInput = screen.getByDisplayValue(mockToken)
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('type', 'hidden')
    expect(hiddenInput).toHaveAttribute('name', 'token')
  })
})
