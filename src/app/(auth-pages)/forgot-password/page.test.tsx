import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPassword from './page'
import { createClient } from '@/utils/supabase/client'
import { forgotPasswordAction } from '@/app/actions'

// Mock dependencies
jest.mock('@/utils/supabase/client')
jest.mock('@/app/actions')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>
const mockForgotPasswordAction = forgotPasswordAction as jest.MockedFunction<
  typeof forgotPasswordAction
>

describe('ForgotPassword Page', () => {
  let mockSupabase: any
  let mockRouter: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
    }
    mockCreateClient.mockReturnValue(mockSupabase)

    // Setup mock router
    mockRouter = {
      push: jest.fn(),
    }
    require('next/navigation').useRouter.mockReturnValue(mockRouter)
  })

  describe('Authentication Check', () => {
    it('should redirect authenticated users to profile page', async () => {
      // Arrange
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
      })

      // Act
      render(<ForgotPassword />)

      // Assert
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/profile')
      })
    })

    it('should show loading state while checking authentication', () => {
      // Arrange
      mockSupabase.auth.getUser.mockImplementation(() => new Promise(() => {}))

      // Act
      render(<ForgotPassword />)

      // Assert
      expect(screen.getByText('Checking Authentication')).toBeInTheDocument()
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
    })

    it('should show form for non-authenticated users', async () => {
      // Arrange
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      // Act
      render(<ForgotPassword />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument()
        expect(
          screen.getByText('Enter your email to receive a reset link')
        ).toBeInTheDocument()
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'Reset Password' })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })
    })

    it('should successfully submit form with valid email', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockResolvedValue(undefined)

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Act
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(mockForgotPasswordAction).toHaveBeenCalled()
      })
    })

    it('should show success message after successful submission', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockResolvedValue(undefined)

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Act
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Check Your Email')).toBeInTheDocument()
        expect(
          screen.getByText("We've sent you a password reset link")
        ).toBeInTheDocument()
        expect(screen.getByText('Reset link sent!')).toBeInTheDocument()
        expect(
          screen.getByText(/We've sent a password reset link to/)
        ).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockImplementation(() => new Promise(() => {}))

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Act
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Assert
      expect(screen.getByText('Sending reset link...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    it('should handle form submission errors gracefully', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockRejectedValue(new Error('Network error'))

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Act
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText('Failed to send reset link. Please try again.')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    beforeEach(async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })
    })

    it('should show success message with submitted email', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockResolvedValue(undefined)

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Act
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'user@example.com')
      await user.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('user@example.com')).toBeInTheDocument()
        expect(screen.getByText('Back to Sign In')).toBeInTheDocument()
        expect(screen.getByText('Try Again')).toBeInTheDocument()
      })
    })

    it('should allow user to try again from success state', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockResolvedValue(undefined)

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Submit form first
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Check Your Email')).toBeInTheDocument()
      })

      // Act - Try again
      const tryAgainButton = screen.getByText('Try Again')
      await user.click(tryAgainButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument()
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Navigation Links', () => {
    beforeEach(async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })
    })

    it('should have link to sign in page', async () => {
      // Arrange
      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Assert
      expect(screen.getByText('Remember your password?')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
    })

    it('should have back to sign in link in success state', async () => {
      // Arrange
      const user = userEvent.setup()
      mockForgotPasswordAction.mockResolvedValue(undefined)

      render(<ForgotPassword />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('you@example.com')
        ).toBeInTheDocument()
      })

      // Submit form
      const emailInput = screen.getByPlaceholderText('you@example.com')
      const submitButton = screen.getByRole('button', {
        name: 'Reset Password',
      })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: 'Back to Sign In' })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    beforeEach(async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })
    })

    it('should handle network errors during authentication check', async () => {
      // Arrange
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Network error'))

      // Act
      render(<ForgotPassword />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument()
      })
    })
  })
})
