import { render, screen, waitFor } from '@testing-library/react'

jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

import CommentsSection from './CommentsSection'

const mockGetUser = jest.fn()

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}))

global.fetch = jest.fn()

const mockComments = [
  {
    id: '1',
    user_id: 'user-1',
    display_name: 'Alice',
    profile_slug: 'alice',
    content_type: 'post',
    content_slug: 'test-post',
    body: 'First comment',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-2',
    display_name: 'Bob',
    profile_slug: 'bob',
    content_type: 'post',
    content_slug: 'test-post',
    body: 'Second comment',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z',
  },
]

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '1 day ago'),
}))

describe('CommentsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ comments: mockComments }),
    })
  })

  it('shows skeleton loading state while fetching', () => {
    mockGetUser.mockReturnValue(new Promise(() => {}))

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading comments')).toBeInTheDocument()
  })

  it('shows sign-in prompt for unauthenticated users', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      expect(screen.getByText('Sign in')).toBeInTheDocument()
      expect(screen.getByText(/to leave a comment/)).toBeInTheDocument()
    })
  })

  it('shows comment form for authenticated users', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1', app_metadata: {} } },
    })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Write a comment...')
      ).toBeInTheDocument()
    })
  })

  it('renders fetched comments', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument()
      expect(screen.getByText('Second comment')).toBeInTheDocument()
    })
  })

  it('shows empty state when no comments exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ comments: [] }),
    })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      expect(
        screen.getByText('No comments yet. Be the first to comment!')
      ).toBeInTheDocument()
    })
  })

  it('renders heading', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      expect(screen.getByText('Comments')).toBeInTheDocument()
    })
  })

  it('detects admin role from app_metadata', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-id', app_metadata: { role: 'admin' } } },
    })

    render(<CommentsSection contentType="post" contentSlug="test-post" />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete')
      expect(deleteButtons.length).toBe(2)
    })
  })
})
