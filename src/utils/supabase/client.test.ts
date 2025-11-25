import { createClient } from './client'

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}))

const { createBrowserClient } = jest.requireMock<{
  createBrowserClient: jest.Mock
}>('@supabase/ssr')

describe('client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createClient', () => {
    it('should be a function', () => {
      // Assert
      expect(typeof createClient).toBe('function')
    })

    it('should be defined', () => {
      // Assert
      expect(createClient).toBeDefined()
    })

    it('should create a Supabase client with correct configuration', () => {
      // Arrange
      const mockSupabaseClient = { auth: {} }
      createBrowserClient.mockReturnValue(mockSupabaseClient)

      // Act
      const result = createClient()

      // Assert
      expect(createBrowserClient).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
          },
        }
      )
      expect(result).toBe(mockSupabaseClient)
    })

    it('should use environment variables for Supabase URL and key', () => {
      // Arrange
      const mockSupabaseClient = { auth: {} }
      createBrowserClient.mockReturnValue(mockSupabaseClient)

      // Act
      createClient()

      // Assert
      expect(createBrowserClient).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        expect.any(Object)
      )
    })

    it('should configure auth with correct options', () => {
      // Arrange
      const mockSupabaseClient = { auth: {} }
      createBrowserClient.mockReturnValue(mockSupabaseClient)

      // Act
      createClient()

      // Assert
      const callArgs = createBrowserClient.mock.calls[0]
      expect(callArgs[2]).toEqual({
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
    })

    it('should handle errors when creating client', () => {
      // Arrange
      const error = new Error('Failed to create client')
      createBrowserClient.mockImplementation(() => {
        throw error
      })

      // Act & Assert
      expect(() => createClient()).toThrow('Failed to create client')
    })
  })
})
