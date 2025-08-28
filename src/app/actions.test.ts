import {
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
} from './actions'

// Mock the modules
jest.mock('@/utils/supabase/server')
jest.mock('@/utils/supabase/safe-client')
jest.mock('@/utils/utils')
jest.mock('next/navigation')
jest.mock('next/headers')

describe('Password Reset Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('forgotPasswordAction', () => {
    it('should handle missing email', async () => {
      // Arrange
      const formData = new FormData()

      // Act & Assert
      await expect(forgotPasswordAction(formData)).rejects.toThrow()
    })

    it('should handle missing email value', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', '')

      // Act & Assert
      await expect(forgotPasswordAction(formData)).rejects.toThrow()
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
      await expect(signInAction(formData)).rejects.toThrow()
    })

    it('should handle missing password', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      // Act & Assert
      await expect(signInAction(formData)).rejects.toThrow()
    })
  })
})
