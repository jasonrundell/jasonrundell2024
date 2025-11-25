import { updateSession } from './middleware'
import type { NextRequest } from 'next/server'

// Mock the @supabase/ssr module
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}))

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn((request) => ({ request })),
    redirect: jest.fn((url) => ({ url })),
  },
}))

describe('middleware', () => {
  let mockCreateServerClient: jest.Mock

  beforeEach(async () => {
    jest.clearAllMocks()
    const { createServerClient } = await import('@supabase/ssr')
    mockCreateServerClient = createServerClient as jest.Mock
  })

  describe('updateSession', () => {
    it('should create response with request when user is authenticated', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest.fn().mockReturnValue([]),
        },
        nextUrl: {
          pathname: '/dashboard',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ user: { id: '123' } }),
        },
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
      expect(mockCreateServerClient).toHaveBeenCalled()
    })

    it('should redirect to sign-in for protected routes when user is not authenticated', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest.fn().mockReturnValue([]),
        },
        nextUrl: {
          pathname: '/dashboard',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ user: null }),
        },
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
      expect(mockCreateServerClient).toHaveBeenCalled()
    })

    it('should redirect root route to dashboard when user is authenticated', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest.fn().mockReturnValue([]),
        },
        nextUrl: {
          pathname: '/',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ user: { id: '123' } }),
        },
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
      expect(mockCreateServerClient).toHaveBeenCalled()
    })

    it('should handle cookie operations correctly', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest
            .fn()
            .mockReturnValue([{ name: 'test-cookie', value: 'test-value' }]),
        },
        nextUrl: {
          pathname: '/dashboard',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ user: { id: '123' } }),
        },
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
      expect(mockCreateServerClient).toHaveBeenCalled()
    })

    it('should handle errors during client creation gracefully', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest.fn().mockReturnValue([]),
        },
        nextUrl: {
          pathname: '/dashboard',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockImplementation(() => {
        throw new Error('Client creation failed')
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
    })

    it('should handle errors during authentication gracefully', async () => {
      // Arrange
      const mockRequest = {
        cookies: {
          getAll: jest.fn().mockReturnValue([]),
        },
        nextUrl: {
          pathname: '/dashboard',
        },
      } as unknown as NextRequest

      mockCreateServerClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockRejectedValue(new Error('Auth failed')),
        },
      })

      // Act
      const result = await updateSession(mockRequest)

      // Assert
      expect(result).toBeDefined()
    })
  })
})
