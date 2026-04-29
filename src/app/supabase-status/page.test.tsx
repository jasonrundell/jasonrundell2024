import { render, screen } from '@testing-library/react'

import SupabaseStatusPage from './page'

jest.mock('@/utils/supabase/status', () => ({
  checkSupabaseStatus: jest.fn(),
}))

jest.mock('@/utils/supabase/safe-client', () => ({
  createSafeClient: jest.fn(),
}))

const { checkSupabaseStatus } = jest.requireMock<{
  checkSupabaseStatus: jest.Mock
}>('@/utils/supabase/status')

const { createSafeClient } = jest.requireMock<{
  createSafeClient: jest.Mock
}>('@/utils/supabase/safe-client')

function mockSafeClient({
  userResult,
  sessionResult,
}: {
  userResult: unknown
  sessionResult: unknown
}) {
  createSafeClient.mockReturnValue({
    getUser: jest.fn().mockResolvedValue(userResult),
    getSession: jest.fn().mockResolvedValue(sessionResult),
  })
}

describe('SupabaseStatusPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders available database, user, and active session details', async () => {
    checkSupabaseStatus.mockResolvedValue({
      isAvailable: true,
      isPaused: false,
    })
    mockSafeClient({
      userResult: {
        isAvailable: true,
        isPaused: false,
        data: { user: { email: 'user@example.com' } },
      },
      sessionResult: {
        isAvailable: true,
        isPaused: false,
        data: { session: { access_token: 'token' } },
      },
    })

    render(await SupabaseStatusPage())

    expect(
      screen.getByRole('heading', { level: 1, name: /supabase status/i })
    ).toBeInTheDocument()
    expect(screen.getAllByText('Yes')).toHaveLength(3)
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders paused and error states without user email or active session', async () => {
    checkSupabaseStatus.mockResolvedValue({
      isAvailable: false,
      isPaused: true,
      error: 'Project paused',
    })
    mockSafeClient({
      userResult: {
        isAvailable: false,
        isPaused: true,
        error: 'Auth paused',
        data: { user: {} },
      },
      sessionResult: {
        isAvailable: false,
        isPaused: true,
        error: 'Session paused',
        data: { session: null },
      },
    })

    render(await SupabaseStatusPage())

    expect(screen.getAllByText('No')).toHaveLength(3)
    expect(screen.getAllByText('Yes')).toHaveLength(3)
    expect(screen.getByText('Project paused')).toBeInTheDocument()
    expect(screen.getByText('Auth paused')).toBeInTheDocument()
    expect(screen.getByText('Session paused')).toBeInTheDocument()
    expect(screen.getByText('No email')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText(/"isPaused": true/)).toBeInTheDocument()
  })
})
