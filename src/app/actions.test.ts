import {
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
} from './actions'
import * as navigation from 'next/navigation'
import { encodedRedirect } from '@/utils/utils'
import { _clearStore } from '@/lib/rate-limit'

// Mock the modules
jest.mock('@/utils/supabase/server')
jest.mock('@/utils/supabase/safe-client')
jest.mock('@/utils/utils')
jest.mock('next/navigation')
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn((name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1'
      if (name === 'origin') return 'http://localhost:3000'
      return null
    }),
  }),
}))

describe('Password Reset Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    _clearStore()
  })

  describe('forgotPasswordAction', () => {
    it('should handle missing email', async () => {
      // Arrange
      const formData = new FormData()

      // Act
      await forgotPasswordAction(formData)

      // Assert — redirects with error when email is missing
      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Email is required'
      )
    })

    it('should handle missing email value', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', '')

      // Act
      await forgotPasswordAction(formData)

      // Assert — empty string is falsy, so treated as missing
      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Email is required'
      )
    })
  })

  describe('resetPasswordAction', () => {
    it('should handle missing password', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('confirmPassword', 'test123')
      formData.append('token', 'test-token')

      // Act & Assert
      await expect(resetPasswordAction(formData)).rejects.toThrow()
    })

    it('should handle missing confirm password', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('password', 'test123')
      formData.append('token', 'test-token')

      // Act & Assert
      await expect(resetPasswordAction(formData)).rejects.toThrow()
    })

    it('should handle missing token', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('password', 'test123')
      formData.append('confirmPassword', 'test123')

      // Act & Assert
      await expect(resetPasswordAction(formData)).rejects.toThrow()
    })

    it('should handle password mismatch', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('password', 'test123')
      formData.append('confirmPassword', 'different')
      formData.append('token', 'test-token')

      // Act & Assert
      await expect(resetPasswordAction(formData)).rejects.toThrow()
    })
  })

  describe('signInAction', () => {
    it('should handle missing email', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('password', 'test123')

      // Act & Assert
      // The action now redirects instead of throwing
      await expect(signInAction(formData)).resolves.toBeUndefined()
      // Verify redirect was called (mocked in jest.setup.js)
      expect(navigation.redirect).toHaveBeenCalled()
    })

    it('should handle missing password', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      // Act & Assert
      // The action now redirects instead of throwing
      await expect(signInAction(formData)).resolves.toBeUndefined()
      // Verify redirect was called (mocked in jest.setup.js)
      expect(navigation.redirect).toHaveBeenCalled()
    })
  })
})
