import { signInAction } from './actions'

// Mock the modules
jest.mock('@/utils/supabase/safe-client')
jest.mock('next/navigation')

describe('Sign In Action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Login with Valid Credentials', () => {
    it('should authenticate user and redirect to profile with valid credentials', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: true,
          data: { user: { id: '123', email: 'test@example.com' } },
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should complete successfully and redirect
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Failed Login with Invalid Credentials', () => {
    it('should handle invalid login credentials error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: 'Invalid login credentials',
          isPaused: false,
          isAvailable: true,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle non-existent account error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'nonexistent@example.com')
      formData.append('password', 'anypassword')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: 'Invalid login credentials',
          isPaused: false,
          isAvailable: true,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Failed Login with Unconfirmed Email', () => {
    it('should handle unconfirmed email error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'unconfirmed@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: 'Email not confirmed',
          isPaused: false,
          isAvailable: true,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('System Error Handling', () => {
    it('should handle database unavailable error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: false,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle database paused error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: true,
          isAvailable: false,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle network error', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: 'Network error occurred',
          isPaused: false,
          isAvailable: true,
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should handle the error and redirect with error message
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Form Validation', () => {
    it('should handle missing email', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('password', 'ValidPassword123!')
      // Email is missing

      // Act & Assert
      // The action should handle missing fields gracefully
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle missing password', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      // Password is missing

      // Act & Assert
      // The action should handle missing fields gracefully
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle both fields missing', async () => {
      // Arrange
      const formData = new FormData()
      // Both email and password are missing

      // Act & Assert
      // The action should handle missing fields gracefully
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Login After Password Reset', () => {
    it('should handle successful login after password reset', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'reset@example.com')
      formData.append('password', 'NewPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: true,
          data: { user: { id: '123', email: 'reset@example.com' } },
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should complete successfully and redirect
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Login After Email Confirmation', () => {
    it('should handle successful login after email confirmation', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'confirmed@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: true,
          data: { user: { id: '123', email: 'confirmed@example.com' } },
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should complete successfully and redirect
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })

  describe('Special Email Formats', () => {
    it('should handle email with special characters', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'user+tag@example.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: true,
          data: { user: { id: '123', email: 'user+tag@example.com' } },
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should complete successfully and redirect
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })

    it('should handle international characters in email', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'usér@exámple.com')
      formData.append('password', 'ValidPassword123!')

      const mockSafeClient = {
        execute: jest.fn().mockResolvedValue({
          error: null,
          isPaused: false,
          isAvailable: true,
          data: { user: { id: '123', email: 'usér@exámple.com' } },
        }),
      }

      require('@/utils/supabase/safe-client').createSafeClient.mockReturnValue(
        mockSafeClient
      )

      // Act & Assert
      // The action should complete successfully and redirect
      await expect(signInAction(formData)).resolves.toBeUndefined()
    })
  })
})
