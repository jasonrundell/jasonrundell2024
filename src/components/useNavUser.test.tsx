import { renderHook, waitFor, act } from '@testing-library/react'
import { useNavUser } from './useNavUser'

const mockPathname = jest.fn(() => '/sign-in')

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}))

const { createClient } = jest.requireMock<{
  createClient: jest.Mock
}>('@/utils/supabase/client')

describe('useNavUser', () => {
  let mockSupabase: {
    auth: {
      getSession: jest.Mock
      refreshSession: jest.Mock
      onAuthStateChange: jest.Mock
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname.mockReturnValue('/sign-in')
    mockSupabase = {
      auth: {
        getSession: jest.fn(),
        refreshSession: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })
    mockSupabase.auth.refreshSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    })
    createClient.mockReturnValue(mockSupabase)
  })

  it('loads initial session and stops loading', async () => {
    const session = {
      user: { id: 'u1', email: 'a@b.com' },
    }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session },
      error: null,
    })

    const { result } = renderHook(() => useNavUser())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.user).toEqual(session.user)
    expect(mockSupabase.auth.getSession).toHaveBeenCalled()
  })

  it('re-syncs session when pathname changes after first render', async () => {
    const loggedInSession = {
      user: { id: 'u1', email: 'a@b.com' },
    }
    mockSupabase.auth.refreshSession.mockResolvedValue({
      data: { session: loggedInSession },
      error: null,
    })

    const { result, rerender } = renderHook(() => useNavUser())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockPathname.mockReturnValue('/profile')
    await act(async () => {
      rerender()
    })

    await waitFor(() => {
      expect(mockSupabase.auth.refreshSession).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(result.current.user).toEqual(loggedInSession.user)
    })
  })

  it('falls back to getSession when refreshSession returns an error', async () => {
    const fallbackSession = {
      user: { id: 'u2', email: 'c@d.com' },
    }
    mockSupabase.auth.refreshSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'refresh failed' },
    })
    mockSupabase.auth.getSession
      .mockResolvedValueOnce({
        data: { session: null },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { session: fallbackSession },
        error: null,
      })

    const { result, rerender } = renderHook(() => useNavUser())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    mockPathname.mockReturnValue('/profile')
    await act(async () => {
      rerender()
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(fallbackSession.user)
    })
    expect(mockSupabase.auth.getSession).toHaveBeenCalled()
  })
})
