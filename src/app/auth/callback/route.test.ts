import { GET } from './route'

// Mock dependencies
const mockSupabase = {
  auth: {
    exchangeCodeForSession: jest.fn(),
  },
}

// Mock the modules
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
  },
}))

// Mock global Request and Response objects
global.Request = class MockRequest {
  url: string
  constructor(url: string) {
    this.url = url
  }
} as unknown as typeof Request

global.Response = class MockResponse {
  constructor() {}
} as unknown as typeof Response

describe('Auth Callback Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should handle recovery flow correctly', async () => {
      // Arrange
      const url =
        'http://localhost:3000/auth/callback?type=recovery&code=recovery-code'
      const request = new Request(url)

      // Act
      await GET(request)

      // Assert
      const { NextResponse } = await import('next/server')
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/reset-password?token=recovery-code'
      )
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
    })

    it('should handle regular auth flow correctly', async () => {
      // Arrange
      const url =
        'http://localhost:3000/auth/callback?type=signup&code=auth-code'
      const request = new Request(url)

      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      })

      // Act
      await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
        'auth-code'
      )
      const { NextResponse } = await import('next/server')
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })

    it('should handle auth flow with redirect_to parameter', async () => {
      // Arrange
      const url =
        'http://localhost:3000/auth/callback?type=signup&code=auth-code&redirect_to=/dashboard'
      const request = new Request(url)

      mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      })

      // Act
      await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
        'auth-code'
      )
      const { NextResponse } = await import('next/server')
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/dashboard'
      )
    })

    it('should handle missing code parameter', async () => {
      // Arrange
      const url = 'http://localhost:3000/auth/callback?type=signup'
      const request = new Request(url)

      // Act
      await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).not.toHaveBeenCalled()
      const { NextResponse } = await import('next/server')
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })

    it('should handle missing type parameter', async () => {
      // Arrange
      const url = 'http://localhost:3000/auth/callback?code=auth-code'
      const request = new Request(url)

      // Act
      await GET(request)

      // Assert
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(
        'auth-code'
      )
      const { NextResponse } = await import('next/server')
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/profile'
      )
    })
  })
})
