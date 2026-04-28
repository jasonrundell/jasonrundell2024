import ProtectedPage from './page'

const mockSafeClient = {
  getUser: jest.fn(),
  getUsers: jest.fn(),
  insertUser: jest.fn(),
  signOut: jest.fn(),
  updateUser: jest.fn(),
}

jest.mock('@/utils/supabase/safe-client', () => ({
  createSafeClient: jest.fn(() => mockSafeClient),
}))

jest.mock('@/lib/profile-slug', () => ({
  generateInitialProfileSlug: jest.fn(() => 'generated-slug'),
}))

jest.mock('@/app/profile/profile-client', () => {
  return function MockProfileClient({
    user,
    userData,
  }: {
    user: { email: string }
    userData?: { full_name?: string }
  }) {
    return (
      <div data-testid="profile-client">
        {user.email} {userData?.full_name}
      </div>
    )
  }
})

jest.mock('@/components/auth/auth-layout', () => ({
  AuthLayout: ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <section data-testid="auth-layout">
      <h1>{title}</h1>
      {children}
    </section>
  ),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`redirect:${url}`)
  }),
}))

const baseUser = {
  id: 'auth-user-id',
  email: 'jason@example.com',
  app_metadata: { provider: 'email' },
}

describe('profile page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSafeClient.getUser.mockResolvedValue({
      data: { user: baseUser },
      error: null,
      isPaused: false,
      isAvailable: true,
    })
    mockSafeClient.getUsers.mockResolvedValue({
      data: [
        {
          auth_user_id: 'auth-user-id',
          full_name: 'Jason Rundell',
          created_at: '2025-01-15T12:00:00.000Z',
          profile_slug: 'jason-rundell',
          profile_slug_changed_at: null,
        },
      ],
      error: null,
    })
  })

  it('renders profile client with existing user data', async () => {
    const page = await ProtectedPage()

    expect(page).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          title: 'Profile',
        }),
      })
    )
    expect(mockSafeClient.getUser).toHaveBeenCalled()
    expect(mockSafeClient.getUsers).toHaveBeenCalledWith('jason@example.com')
  })

  it('redirects when Supabase is paused', async () => {
    mockSafeClient.getUser.mockResolvedValue({
      data: null,
      error: 'paused',
      isPaused: true,
      isAvailable: false,
    })

    await expect(ProtectedPage()).rejects.toThrow(
      'redirect:/sign-in?error=supabase_paused'
    )
  })

  it('redirects when user data cannot be loaded', async () => {
    mockSafeClient.getUsers.mockResolvedValue({
      data: null,
      error: 'User lookup failed',
    })

    await expect(ProtectedPage()).rejects.toThrow(
      'redirect:/sign-in?error=user_not_found'
    )
  })

  it('backfills missing auth user id on existing records', async () => {
    mockSafeClient.getUsers.mockResolvedValue({
      data: [
        {
          auth_user_id: null,
          full_name: 'Jason Rundell',
          created_at: '2025-01-15T12:00:00.000Z',
          profile_slug: 'jason-rundell',
          profile_slug_changed_at: null,
        },
      ],
      error: null,
    })

    await ProtectedPage()

    expect(mockSafeClient.updateUser).toHaveBeenCalledWith('jason@example.com', {
      auth_user_id: 'auth-user-id',
    })
  })

  it('creates a basic profile record when one does not exist', async () => {
    mockSafeClient.getUsers.mockResolvedValue({ data: [], error: null })
    mockSafeClient.insertUser.mockResolvedValue({
      data: {
        full_name: 'jason',
        created_at: '2025-01-15T12:00:00.000Z',
        profile_slug: 'generated-slug',
        profile_slug_changed_at: null,
      },
      error: null,
    })

    await ProtectedPage()

    expect(mockSafeClient.insertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'jason@example.com',
        auth_user_id: 'auth-user-id',
        profile_slug: 'generated-slug',
        provider: 'email',
      })
    )
  })
})
