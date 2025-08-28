import { createClient } from './server'

// Mock dependencies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

describe('server', () => {
  let mockCreateServerClient: jest.Mock
  let mockCookies: jest.Mock
  let mockCookieStore: {
    get: jest.Mock
    set: jest.Mock
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    // Get references to the mocked functions
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')

    mockCreateServerClient = createServerClient as jest.Mock
    mockCookies = cookies as jest.Mock

    // Create a mock cookie store
    mockCookieStore = {
      get: jest.fn(),
      set: jest.fn(),
    }

    mockCookies.mockReturnValue(mockCookieStore)
  })

  describe('createClient', () => {
    it('should be a function', () => {
      expect(typeof createClient).toBe('function')
    })

    it('should be defined', () => {
      expect(createClient).toBeDefined()
    })

    it('should create a Supabase client with correct configuration', () => {
      // Arrange
      const mockSupabaseClient = { auth: {} }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      // Act
      const result = createClient()

      // Assert
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get: expect.any(Function),
            set: expect.any(Function),
            remove: expect.any(Function),
          },
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      )
      expect(result).toBe(mockSupabaseClient)
    })

    it('should use provided cookie store when passed as parameter', () => {
      // Arrange
      const customCookieStore = {
        get: jest.fn(),
        set: jest.fn(),
        getAll: jest.fn(),
        has: jest.fn(),
        delete: jest.fn(),
        [Symbol.iterator]: jest.fn(),
        size: 0,
      }
      const mockSupabaseClient = { auth: {} }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      // Act
      createClient(customCookieStore)

      // Assert
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get: expect.any(Function),
            set: expect.any(Function),
            remove: expect.any(Function),
          },
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      )
    })

    it('should use default cookies() when no cookie store provided', () => {
      // Arrange
      const mockSupabaseClient = { auth: {} }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      // Act
      createClient()

      // Assert
      expect(mockCookies).toHaveBeenCalled()
    })

    describe('cookie handlers', () => {
      let cookieHandlers: {
        get: (name: string) => string | undefined
        set: (
          name: string,
          value: string,
          options: Record<string, unknown>
        ) => void
        remove: (name: string, options: Record<string, unknown>) => void
      }

      beforeEach(() => {
        const mockSupabaseClient = { auth: {} }
        mockCreateServerClient.mockReturnValue(mockSupabaseClient)

        createClient()
        cookieHandlers = mockCreateServerClient.mock.calls[0][2].cookies
      })

      describe('get', () => {
        it('should get cookie value from cookie store', () => {
          // Arrange
          const cookieName = 'test-cookie'
          const cookieValue = 'test-value'
          mockCookieStore.get.mockReturnValue({ value: cookieValue })

          // Act
          const result = cookieHandlers.get(cookieName)

          // Assert
          expect(mockCookieStore.get).toHaveBeenCalledWith(cookieName)
          expect(result).toBe(cookieValue)
        })

        it('should return undefined when cookie does not exist', () => {
          // Arrange
          const cookieName = 'non-existent-cookie'
          mockCookieStore.get.mockReturnValue(undefined)

          // Act
          const result = cookieHandlers.get(cookieName)

          // Assert
          expect(result).toBeUndefined()
        })

        it('should handle cookie with no value property', () => {
          // Arrange
          const cookieName = 'cookie-without-value'
          mockCookieStore.get.mockReturnValue({})

          // Act
          const result = cookieHandlers.get(cookieName)

          // Assert
          expect(result).toBeUndefined()
        })
      })

      describe('set', () => {
        it('should set cookie in cookie store', () => {
          // Arrange
          const name = 'test-cookie'
          const value = 'test-value'
          const options = { maxAge: 3600 }

          // Act
          cookieHandlers.set(name, value, options)

          // Assert
          expect(mockCookieStore.set).toHaveBeenCalledWith({
            name,
            value,
            ...options,
          })
        })

        it('should handle set errors gracefully', () => {
          // Arrange
          const name = 'test-cookie'
          const value = 'test-value'
          const options = { maxAge: 3600 }
          mockCookieStore.set.mockImplementation(() => {
            throw new Error('Set failed')
          })

          // Act & Assert - should not throw
          expect(() => {
            cookieHandlers.set(name, value, options)
          }).not.toThrow()
        })
      })

      describe('remove', () => {
        it('should remove cookie by setting empty value', () => {
          // Arrange
          const name = 'test-cookie'
          const options = { maxAge: 3600 }

          // Act
          cookieHandlers.remove(name, options)

          // Assert
          expect(mockCookieStore.set).toHaveBeenCalledWith({
            name,
            value: '',
            ...options,
          })
        })

        it('should handle remove errors gracefully', () => {
          // Arrange
          const name = 'test-cookie'
          const options = { maxAge: 3600 }
          mockCookieStore.set.mockImplementation(() => {
            throw new Error('Remove failed')
          })

          // Act & Assert - should not throw
          expect(() => {
            cookieHandlers.remove(name, options)
          }).not.toThrow()
        })
      })
    })

    describe('auth configuration', () => {
      it('should configure auth with correct options', () => {
        // Arrange
        const mockSupabaseClient = { auth: {} }
        mockCreateServerClient.mockReturnValue(mockSupabaseClient)

        // Act
        createClient()

        // Assert
        const authConfig = mockCreateServerClient.mock.calls[0][2].auth
        expect(authConfig).toEqual({
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        })
      })
    })

    describe('environment variables', () => {
      it('should pass environment variables to createServerClient', () => {
        // Arrange
        const mockSupabaseClient = { auth: {} }
        mockCreateServerClient.mockReturnValue(mockSupabaseClient)

        // Act
        createClient()

        // Assert
        const callArgs = mockCreateServerClient.mock.calls[0]
        expect(callArgs[0]).toBe(process.env.NEXT_PUBLIC_SUPABASE_URL)
        expect(callArgs[1]).toBe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        expect(callArgs[2]).toEqual({
          cookies: {
            get: expect.any(Function),
            set: expect.any(Function),
            remove: expect.any(Function),
          },
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        })
      })

      it('should handle undefined environment variables gracefully', () => {
        // Arrange
        const mockSupabaseClient = { auth: {} }
        mockCreateServerClient.mockReturnValue(mockSupabaseClient)

        // Act
        createClient()

        // Assert - the function should still work even if env vars are undefined in test
        expect(mockCreateServerClient).toHaveBeenCalledWith(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          expect.any(Object)
        )
      })
    })
  })
})
