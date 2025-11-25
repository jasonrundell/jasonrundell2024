import { SafeSupabaseClient, createSafeClient } from './safe-client'

// Mock dependencies
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/utils/supabase/status', () => ({
  checkSupabaseStatus: jest.fn(),
}))

describe('safe-client', () => {
  let safeClient: SafeSupabaseClient
  let mockCreateClient: jest.Mock
  let mockCheckSupabaseStatus: jest.Mock

  beforeEach(async () => {
    jest.clearAllMocks()

    // Get references to the mocked functions
    const { createClient } = await import('@/utils/supabase/server')
    const { checkSupabaseStatus } = await import('@/utils/supabase/status')

    mockCreateClient = createClient as jest.Mock
    mockCheckSupabaseStatus = checkSupabaseStatus as jest.Mock

    safeClient = new SafeSupabaseClient()
  })

  describe('SafeSupabaseClient', () => {
    it('should be a class', () => {
      expect(typeof SafeSupabaseClient).toBe('function')
    })

    it('should be defined', () => {
      expect(SafeSupabaseClient).toBeDefined()
    })

    it('should create an instance with default properties', () => {
      expect(safeClient).toBeInstanceOf(SafeSupabaseClient)
    })
  })

  describe('createSafeClient', () => {
    it('should be a function', () => {
      expect(typeof createSafeClient).toBe('function')
    })

    it('should be defined', () => {
      expect(createSafeClient).toBeDefined()
    })

    it('should return a SafeSupabaseClient instance', () => {
      const client = createSafeClient()
      expect(client).toBeInstanceOf(SafeSupabaseClient)
    })
  })

  describe('SafeSupabaseClient.execute', () => {
    it('should return error result when Supabase is unavailable', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: false,
        isPaused: false,
        error: 'Database connection failed',
      })

      const result = await safeClient.execute(async () => ({
        data: 'test',
        error: null,
      }))

      expect(result).toEqual({
        data: null,
        error: 'Database connection failed',
        isPaused: false,
        isAvailable: false,
      })
    })

    it('should return error result when Supabase is paused', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: false,
        isPaused: true,
        error: 'Database is paused',
      })

      const result = await safeClient.execute(async () => ({
        data: 'test',
        error: null,
      }))

      expect(result).toEqual({
        data: null,
        error: 'Database is paused',
        isPaused: true,
        isAvailable: false,
      })
    })

    it('should return error result when Supabase is unavailable with no error message', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: false,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => ({
        data: 'test',
        error: null,
      }))

      expect(result).toEqual({
        data: null,
        error: 'Database unavailable',
        isPaused: false,
        isAvailable: false,
      })
    })

    it('should execute operation successfully when Supabase is available', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => ({
        data: 'success data',
        error: null,
      }))

      expect(result).toEqual({
        data: 'success data',
        error: null,
        isPaused: false,
        isAvailable: true,
      })
    })

    it('should handle operation with error object', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => ({
        data: null,
        error: { message: 'Operation failed' },
      }))

      expect(result).toEqual({
        data: null,
        error: 'Operation failed',
        isPaused: false,
        isAvailable: true,
      })
    })

    it('should handle operation with non-object error', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => ({
        data: null,
        error: 'Simple error string',
      }))

      expect(result).toEqual({
        data: null,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
    })

    it('should handle operation exceptions', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => {
        throw new Error('Operation exception')
      })

      expect(result).toEqual({
        data: null,
        error: 'Operation exception',
        isPaused: false,
        isAvailable: false,
      })
    })

    it('should handle non-Error exceptions', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const result = await safeClient.execute(async () => {
        throw 'String exception'
      })

      expect(result).toEqual({
        data: null,
        error: 'Unknown error',
        isPaused: false,
        isAvailable: false,
      })
    })
  })

  describe('SafeSupabaseClient status caching', () => {
    it('should cache status for 30 seconds', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      // First call should check status
      await safeClient.execute(async () => ({ data: 'test', error: null }))
      expect(mockCheckSupabaseStatus).toHaveBeenCalledTimes(1)

      // Second call within cache duration should use cached status
      await safeClient.execute(async () => ({ data: 'test2', error: null }))
      expect(mockCheckSupabaseStatus).toHaveBeenCalledTimes(1)
    })

    it('should refresh status after cache expires', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      // First call
      await safeClient.execute(async () => ({ data: 'test', error: null }))
      expect(mockCheckSupabaseStatus).toHaveBeenCalledTimes(1)

      // Mock Date.now to simulate cache expiration
      const originalDateNow = Date.now
      Date.now = jest.fn(() => originalDateNow() + 31000) // 31 seconds later

      // Second call after cache expires
      await safeClient.execute(async () => ({ data: 'test2', error: null }))
      expect(mockCheckSupabaseStatus).toHaveBeenCalledTimes(2)

      // Restore original Date.now
      Date.now = originalDateNow
    })
  })

  describe('SafeSupabaseClient.getUser', () => {
    it('should get user data successfully', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockUser = { id: '123', email: 'test@example.com' }
      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.getUser()

      expect(result).toEqual({
        data: { user: mockUser },
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockCreateClient).toHaveBeenCalled()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    })

    it('should handle getUser errors', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockSupabaseClient = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'User not found' },
          }),
        },
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.getUser()

      expect(result).toEqual({
        data: { user: null },
        error: 'User not found',
        isPaused: false,
        isAvailable: true,
      })
    })
  })

  describe('SafeSupabaseClient.getSession', () => {
    it('should get session data successfully', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockSession = { access_token: 'token123', user: { id: '123' } }
      const mockSupabaseClient = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: mockSession },
            error: null,
          }),
        },
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.getSession()

      expect(result).toEqual({
        data: { session: mockSession },
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockCreateClient).toHaveBeenCalled()
      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled()
    })
  })

  describe('SafeSupabaseClient.signOut', () => {
    it('should sign out successfully', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockSupabaseClient = {
        auth: {
          signOut: jest.fn().mockResolvedValue({
            error: null,
          }),
        },
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.signOut()

      expect(result).toEqual({
        data: null,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockCreateClient).toHaveBeenCalled()
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('SafeSupabaseClient.getUsers', () => {
    it('should get all users when no email provided', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockUsers = [
        { id: '1', email: 'user1@example.com' },
        { id: '2', email: 'user2@example.com' },
      ]
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }
      // Mock the query to resolve directly without .then()
      mockQuery.select.mockResolvedValue({ data: mockUsers, error: null })

      const mockSupabaseClient = {
        from: jest.fn().mockReturnValue(mockQuery),
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.getUsers()

      expect(result).toEqual({
        data: mockUsers,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
    })

    it('should filter users by email when provided', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const mockUser = { id: '1', email: 'specific@example.com' }
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }
      // Mock the query to resolve directly without .then()
      mockQuery.eq.mockResolvedValue({ data: mockUser, error: null })

      const mockSupabaseClient = {
        from: jest.fn().mockReturnValue(mockQuery),
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.getUsers('specific@example.com')

      expect(result).toEqual({
        data: mockUser,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockQuery.eq).toHaveBeenCalledWith('email', 'specific@example.com')
    })
  })

  describe('SafeSupabaseClient.insertUser', () => {
    it('should insert user successfully', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const userData = { email: 'new@example.com', name: 'New User' }
      const mockUser = { id: '123', ...userData }
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      }
      const mockSupabaseClient = {
        from: jest.fn().mockReturnValue(mockQuery),
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.insertUser(userData)

      expect(result).toEqual({
        data: mockUser,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
      expect(mockQuery.insert).toHaveBeenCalledWith([userData])
      expect(mockQuery.select).toHaveBeenCalled()
      expect(mockQuery.single).toHaveBeenCalled()
    })
  })

  describe('SafeSupabaseClient.updateUser', () => {
    it('should update user successfully', async () => {
      mockCheckSupabaseStatus.mockResolvedValue({
        isAvailable: true,
        isPaused: false,
        error: null,
      })

      const userData = { name: 'Updated Name' }
      const mockUser = { id: '123', email: 'test@example.com', ...userData }
      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      }
      const mockSupabaseClient = {
        from: jest.fn().mockReturnValue(mockQuery),
      }
      mockCreateClient.mockResolvedValue(mockSupabaseClient)

      const result = await safeClient.updateUser('test@example.com', userData)

      expect(result).toEqual({
        data: mockUser,
        error: null,
        isPaused: false,
        isAvailable: true,
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
      expect(mockQuery.update).toHaveBeenCalledWith(userData)
      expect(mockQuery.eq).toHaveBeenCalledWith('email', 'test@example.com')
      expect(mockQuery.select).toHaveBeenCalled()
      expect(mockQuery.single).toHaveBeenCalled()
    })
  })
})
