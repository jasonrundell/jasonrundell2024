import { GET } from './route'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Mock dependencies
jest.mock('@/utils/supabase/server')
jest.mock('next/server')

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>
const mockNextResponse = NextResponse as jest.MockedClass<typeof NextResponse>

describe('Auth Callback Route', () => {
  let mockSupabase: any
  let mockRequest: Request

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn(),
      },
    }
    mockCreateClient.mockReturnValue(mockSupabase)

    // Setup mock request
    mockRequest = {
      url: 'http://localhost:3000/auth/callback?code=test-code&type=recovery',
    } as Request

    // Mock NextResponse.redirect
    mockNextResponse.redirect = jest.fn().mockReturnValue({} as NextResponse)
  })

  describe('Password Recovery Flow', () => {
    it('should handle recovery type and redirect to reset password page', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=recovery-code&type=recovery',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/reset-password?token=recovery-code'
      )
    })

    it('should handle recovery type without creating session', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=recovery-code&type=recovery',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
    })
  })

  describe('Regular Auth Flow', () => {
    it('should handle regular auth codes and create session', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=regular-code',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
        'regular-code'
      )
    })

    it('should redirect to profile for regular auth flow', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=regular-code',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })
  })

  describe('Redirect Handling', () => {
    it('should handle custom redirect_to parameter', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=test-code&redirect_to=/custom-page',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/custom-page'
      )
    })

    it('should handle redirect_to with recovery type', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=recovery-code&type=recovery&redirect_to=/custom-page',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      // Recovery type should take precedence over redirect_to
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/reset-password?token=recovery-code'
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle request without code parameter', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })

    it('should handle request with empty code parameter', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:3000/auth/callback?code=',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })

    it('should handle malformed URL gracefully', async () => {
      // Arrange
      const request = {
        url: 'invalid-url',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })
  })

  describe('URL Parsing', () => {
    it('should correctly parse origin from request URL', async () => {
      // Arrange
      const request = {
        url: 'https://example.com/auth/callback?code=test-code&type=recovery',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'https://example.com/reset-password?token=test-code'
      )
    })

    it('should handle different port numbers', async () => {
      // Arrange
      const request = {
        url: 'http://localhost:8080/auth/callback?code=test-code&type=recovery',
      } as Request

      // Act
      const result = await GET(request)

      // Assert
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:8080/reset-password?token=test-code'
      )
    })
  })
})
