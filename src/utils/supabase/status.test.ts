import { checkSupabaseStatus } from './status'

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
})
