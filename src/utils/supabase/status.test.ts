import {
  checkSupabaseStatus,
  checkSupabaseStatusWithTimeout,
  getSupabaseStatusMessage,
} from './status'

// Mock the server module
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('status', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkSupabaseStatus', () => {
    it('should return available status when Supabase is working', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest
              .fn()
              .mockResolvedValue({ data: [{ id: 1 }], error: null }),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatus()

      // Assert
      expect(result).toEqual({
        isAvailable: true,
        isPaused: false,
      })
    })

    it('should return paused status when database is paused', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'service unavailable' },
            }),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatus()

      // Assert
      expect(result).toEqual({
        isAvailable: false,
        isPaused: true,
        error: 'Supabase project is currently paused',
      })
    })

    it('should return error status when there is an error', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'connection failed' },
            }),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatus()

      // Assert
      expect(result).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'connection failed',
      })
    })

    it('should handle network errors gracefully', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValue(new Error('Network error')),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatus()

      // Assert
      expect(result).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Network error',
      })
    })
  })

  describe('checkSupabaseStatusWithTimeout', () => {
    it('should return status when check completes within timeout', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest
              .fn()
              .mockResolvedValue({ data: [{ id: 1 }], error: null }),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatusWithTimeout(1000)

      // Assert
      expect(result).toEqual({
        isAvailable: true,
        isPaused: false,
      })
    })

    it('should timeout when status check takes too long', async () => {
      // Arrange
      const { createClient } = await import('@/utils/supabase/server')
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest
              .fn()
              .mockImplementation(
                () =>
                  new Promise((resolve) =>
                    setTimeout(() => resolve({ data: null, error: null }), 100)
                  )
              ),
          }),
        }),
      }
      createClient.mockReturnValue(mockClient)

      // Act
      const result = await checkSupabaseStatusWithTimeout(50)

      // Assert
      expect(result).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Timeout',
      })
    })
  })

  describe('getSupabaseStatusMessage', () => {
    it('should return available message for working database', () => {
      // Arrange
      const status = { isAvailable: true, isPaused: false }

      // Act
      const message = getSupabaseStatusMessage(status)

      // Assert
      expect(message).toBe('Database is available')
    })

    it('should return paused message for paused database', () => {
      // Arrange
      const status = {
        isAvailable: false,
        isPaused: true,
        error: 'service unavailable',
      }

      // Act
      const message = getSupabaseStatusMessage(status)

      // Assert
      expect(message).toBe(
        'Database is currently paused. Please resume your Supabase project to continue.'
      )
    })

    it('should return error message for database with errors', () => {
      // Arrange
      const status = {
        isAvailable: false,
        isPaused: false,
        error: 'connection failed',
      }

      // Act
      const message = getSupabaseStatusMessage(status)

      // Assert
      expect(message).toBe('connection failed')
    })

    it('should return timeout message for timeout errors', () => {
      // Arrange
      const status = {
        isAvailable: false,
        isPaused: false,
        error: 'Connection timeout',
      }

      // Act
      const message = getSupabaseStatusMessage(status)

      // Assert
      expect(message).toBe('Connection timeout')
    })
  })
})
