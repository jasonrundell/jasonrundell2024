import {
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
} from './actions'
import { createClient } from '@/utils/supabase/server'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { encodedRedirect } from '@/utils/utils'
import { redirect } from 'next/navigation'

// Mock dependencies
jest.mock('@/utils/supabase/server')
jest.mock('@/utils/supabase/safe-client')
jest.mock('@/utils/utils')
jest.mock('next/navigation')
jest.mock('next/headers')

// Mock global objects
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>
const mockCreateSafeClient = createSafeClient as jest.MockedFunction<
  typeof createSafeClient
>
const mockEncodedRedirect = encodedRedirect as jest.MockedFunction<
  typeof encodedRedirect
>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>

describe('Password Reset Actions', () => {
  let mockSupabase: any
  let mockSafeClient: any
  let mockFormData: FormData

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        exchangeCodeForSession: jest.fn(),
        updateUser: jest.fn(),
        signOut: jest.fn(),
        signInWithPassword: jest.fn(),
      },
    }
    mockCreateClient.mockReturnValue(mockSupabase)

    // Setup mock safe client
    mockSafeClient = {
      execute: jest.fn(),
      insertUser: jest.fn(),
    }
    mockCreateSafeClient.mockReturnValue(mockSafeClient)

    // Setup mock FormData
    mockFormData = new FormData()

    // Mock headers
    const mockHeaders = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    }
    ;(require('next/headers') as any).headers.mockReturnValue(mockHeaders)
  })

  describe('forgotPasswordAction', () => {
    it('should successfully send password reset email', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

      // Act
      const result = await forgotPasswordAction(mockFormData)

      // Assert
      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'http://localhost:3000/auth/callback?type=recovery',
        }
      )
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'success',
        '/forgot-password',
        'Check your email for a link to reset your password.'
      )
    })

    it('should reject request when user is already authenticated', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
      })

      // Act
      const result = await forgotPasswordAction(mockFormData)

      // Assert
      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled()
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'You are already logged in. If you need to change your password, please use the change password option in your profile.'
      )
    })

    it('should reject request when email is missing', async () => {
      // Arrange
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      // Act
      const result = await forgotPasswordAction(mockFormData)

      // Assert
      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled()
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Email is required'
      )
    })

    it('should handle Supabase errors gracefully', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Network error' },
      })

      // Act
      const result = await forgotPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Could not reset password'
      )
    })
  })

  describe('resetPasswordAction', () => {
    it('should successfully reset password with valid token', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        error: null,
      })
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null })
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
        'valid-token'
      )
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123',
      })
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(mockRedirect).toHaveBeenCalledWith(
        '/sign-in?message=password_reset_success'
      )
    })

    it('should reject reset when user is already authenticated', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
      })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'You are already logged in. If you need to change your password, please use the change password option in your profile.'
      )
    })

    it('should reject reset when password is missing', async () => {
      // Arrange
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'Password and confirm password are required'
      )
    })

    it('should reject reset when confirm password is missing', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'Password and confirm password are required'
      )
    })

    it('should reject reset when token is missing', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'Invalid or missing reset token'
      )
    })

    it('should reject reset when passwords do not match', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'differentPassword')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'Passwords do not match'
      )
    })

    it('should handle invalid token gracefully', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'invalid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        error: { message: 'Invalid token' },
      })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'The password reset link is invalid or has expired. Please request a new one.'
      )
    })

    it('should handle password update errors gracefully', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        error: null,
      })
      mockSupabase.auth.updateUser.mockResolvedValue({
        error: { message: 'Password update failed' },
      })

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'Password update failed. Please try again.'
      )
    })

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockFormData.set('password', 'newPassword123')
      mockFormData.set('confirmPassword', 'newPassword123')
      mockFormData.set('token', 'valid-token')
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      mockSupabase.auth.exchangeCodeForSession.mockRejectedValue(
        new Error('Unexpected error')
      )

      // Act
      const result = await resetPasswordAction(mockFormData)

      // Assert
      expect(mockEncodedRedirect).toHaveBeenCalledWith(
        'error',
        '/reset-password',
        'An unexpected error occurred. Please try again.'
      )
    })
  })

  describe('signInAction', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')
      mockSafeClient.execute.mockResolvedValue({
        error: null,
        isPaused: false,
        isAvailable: true,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockSafeClient.execute).toHaveBeenCalled()
      expect(mockRedirect).toHaveBeenCalledWith('/profile')
    })

    it('should handle database paused state', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')
      mockSafeClient.execute.mockResolvedValue({
        error: null,
        isPaused: true,
        isAvailable: false,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockRedirect).toHaveBeenCalledWith(
        '/sign-in?error=supabase_paused'
      )
    })

    it('should handle database unavailable state', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')
      mockSafeClient.execute.mockResolvedValue({
        error: null,
        isPaused: false,
        isAvailable: false,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockRedirect).toHaveBeenCalledWith(
        '/sign-in?error=supabase_unavailable'
      )
    })

    it('should handle invalid credentials error', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'wrongpassword')
      mockSafeClient.execute.mockResolvedValue({
        error: 'Invalid login credentials',
        isPaused: false,
        isAvailable: true,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockRedirect).toHaveBeenCalledWith(
        '/sign-in?error=invalid_credentials'
      )
    })

    it('should handle email not confirmed error', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')
      mockSafeClient.execute.mockResolvedValue({
        error: 'Email not confirmed',
        isPaused: false,
        isAvailable: true,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockRedirect).toHaveBeenCalledWith(
        '/sign-in?error=email_not_confirmed'
      )
    })

    it('should handle generic auth errors', async () => {
      // Arrange
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')
      mockSafeClient.execute.mockResolvedValue({
        error: 'Some other auth error',
        isPaused: false,
        isAvailable: true,
      })

      // Act
      const result = await signInAction(mockFormData)

      // Assert
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in?error=auth_error')
    })
  })
})
