import { signUpAction } from './sign-up'
import type { createClient } from '@/utils/supabase/server'

// Mock the modules
jest.mock('@/utils/supabase/server')
jest.mock('next/navigation')

// Get the mocked createClient
const { createClient: mockCreateClient } = jest.requireMock<{
  createClient: typeof createClient
}>('@/utils/supabase/server')

describe('Sign Up Action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Registration with Valid Information', () => {
    it('should create account and redirect when passwords match', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({ error: null }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act & Assert
      await expect(signUpAction(formData)).resolves.toBeUndefined()
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'ValidPassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })
  })

  describe('Password Validation', () => {
    it('should return error when passwords do not match', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'DifferentPassword123!')

      // Act
      const result = await signUpAction(formData)

      // Assert
      expect(result).toEqual({
        error: 'Passwords do not match',
        status: 400,
      })
    })

    it('should return error when password confirmation is missing', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      // confirmPassword is missing

      // Act
      const result = await signUpAction(formData)

      // Assert
      expect(result).toEqual({
        error: 'Passwords do not match',
        status: 400,
      })
    })
  })

  describe('Supabase Error Handling', () => {
    it('should return error when Supabase signUp fails', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({
            error: { message: 'User already registered', status: 400 },
          }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act
      const result = await signUpAction(formData)

      // Assert
      expect(result).toEqual({
        error: 'User already registered',
        status: 400,
      })
    })

    it('should return error with default status when Supabase error has no status', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({
            error: { message: 'Unknown error' },
          }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act
      const result = await signUpAction(formData)

      // Assert
      expect(result).toEqual({
        error: 'Unknown error',
        status: 400,
      })
    })
  })

  describe('Form Data Handling', () => {
    it('should extract email and password from FormData correctly', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'MyPassword123!')
      formData.append('confirmPassword', 'MyPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({ error: null }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act
      await signUpAction(formData)

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'MyPassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })

    it('should handle empty email field', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', '')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({ error: null }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act
      await signUpAction(formData)

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: '',
        password: 'ValidPassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })
  })

  describe('Email Redirect Configuration', () => {
    it('should include correct email redirect URL', async () => {
      // Arrange
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({ error: null }),
        },
      }

      ;(mockCreateClient as jest.Mock).mockResolvedValue(mockSupabase)

      // Act
      await signUpAction(formData)

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'ValidPassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })
  })
})
