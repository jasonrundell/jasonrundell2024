import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ForgotPassword from './page'

// Mock dependencies
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
}

const mockUseRouter = jest.fn()

// Mock the modules
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('lucide-react', () => ({
  CheckCircle: () => 'CheckCircle',
  ArrowLeft: () => 'ArrowLeft',
}))

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    })
  })

  it('should render the forgot password page', async () => {
    // Arrange
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    // Act
    render(<ForgotPassword />)

    // Assert
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Reset Password' })
      ).toBeInTheDocument()
    })
  })

  it('should redirect authenticated users to profile', async () => {
    // Arrange
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null,
    })

    const mockPush = jest.fn()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })

    // Act
    render(<ForgotPassword />)

    // Assert
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile')
    })
  })

  it('should handle authentication check errors gracefully', async () => {
    // Arrange
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth check failed' },
    })

    // Act
    render(<ForgotPassword />)

    // Assert
    // Should show form even when there's an error in the response
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Reset Password' })
      ).toBeInTheDocument()
    })
  })
})
