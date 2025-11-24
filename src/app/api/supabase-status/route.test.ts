import { GET } from './route'

// Mock dependencies
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

const { createServerClient } = jest.requireMock<{
  createServerClient: jest.Mock
}>('@supabase/ssr')

const { cookies } = jest.requireMock<{
  cookies: jest.Mock
}>('next/headers')

describe('GET /api/supabase-status', () => {
  let mockSupabaseClient: {
    from: jest.Mock
  }
  let mockCookieStore: {
    get: jest.Mock
    set: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    // Setup mock cookie store
    mockCookieStore = {
      get: jest.fn(),
      set: jest.fn(),
    }
    cookies.mockReturnValue(mockCookieStore)

    // Setup mock Supabase client
    mockSupabaseClient = {
      from: jest.fn(),
    }
    createServerClient.mockReturnValue(mockSupabaseClient)
  })

  describe('Environment Variables', () => {
    it('should return error when Supabase URL is missing', async () => {
      // Arrange
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Supabase environment variables not configured',
      })
    })

    it('should return error when Supabase anon key is missing', async () => {
      // Arrange
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Supabase environment variables not configured',
      })
    })
  })

  describe('Successful Status Check', () => {
    it('should return available status when Supabase is accessible', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({ error: null }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        isAvailable: true,
        isPaused: false,
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
    })
  })

  describe('Paused State Detection', () => {
    it('should detect paused state from error message', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          error: { message: 'Project is paused', code: null },
        }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: true,
        error: 'Supabase project is currently paused',
      })
    })

    it('should detect paused state from suspended message', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          error: { message: 'Project is suspended', code: null },
        }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(data.isPaused).toBe(true)
    })

    it('should detect paused state from PGRST301 error code', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          error: { message: 'Service unavailable', code: 'PGRST301' },
        }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(data.isPaused).toBe(true)
    })

    it('should detect paused state from PGRST302 error code', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          error: { message: 'Service unavailable', code: 'PGRST302' },
        }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(data.isPaused).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should return unavailable status for non-paused errors', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          error: { message: 'Connection timeout', code: null },
        }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Connection timeout',
      })
    })

    it('should handle exceptions gracefully', async () => {
      // Arrange
      createServerClient.mockImplementation(() => {
        throw new Error('Failed to create client')
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Failed to create client',
      })
    })

    it('should handle non-Error exceptions', async () => {
      // Arrange
      createServerClient.mockImplementation(() => {
        throw 'String error'
      })

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({
        isAvailable: false,
        isPaused: false,
        error: 'Unknown error',
      })
    })
  })

  describe('Cookie Handling', () => {
    it('should use cookie store for Supabase client', async () => {
      // Arrange
      const mockSelect = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({ error: null }),
      })
      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      // Act
      await GET()

      // Assert
      expect(cookies).toHaveBeenCalled()
      expect(createServerClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          cookies: expect.objectContaining({
            get: expect.any(Function),
            set: expect.any(Function),
            remove: expect.any(Function),
          }),
        })
      )
    })
  })
})

