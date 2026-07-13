import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ResetPasswordClient from './reset-password-client'

const mockResetPasswordAction = jest.fn()

jest.mock('@/app/actions', () => ({
  resetPasswordAction: (...args: unknown[]) => mockResetPasswordAction(...args),
}))

jest.mock('@/components/auth/auth-layout', () => ({
  AuthLayout: function MockAuthLayout({
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
  },
}))

describe('ResetPasswordClient', () => {
  const mockToken = 'test-token-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the password reset form', () => {
    render(<ResetPasswordClient token={mockToken} />)

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
    render(<ResetPasswordClient token={mockToken} />)

    const hiddenInput = screen.getByDisplayValue(mockToken)
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('type', 'hidden')
    expect(hiddenInput).toHaveAttribute('name', 'token')
  })

  it('should show an error alert for real failures', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockRejectedValue(new Error('Network down'))

    render(<ResetPasswordClient token={mockToken} />)

    await user.type(screen.getByLabelText('New password'), 'NewPass1!')
    await user.type(screen.getByLabelText('Confirm password'), 'NewPass1!')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network down')
    })
    expect(
      screen.getByRole('button', { name: 'Reset password' })
    ).not.toBeDisabled()
  })

  it('should show a fallback error message for non-Error throws', async () => {
    const user = userEvent.setup()
    mockResetPasswordAction.mockRejectedValue('boom')

    render(<ResetPasswordClient token={mockToken} />)

    await user.type(screen.getByLabelText('New password'), 'NewPass1!')
    await user.type(screen.getByLabelText('Confirm password'), 'NewPass1!')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to reset password. Please try again.'
      )
    })
  })
})
