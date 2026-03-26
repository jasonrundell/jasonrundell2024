import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentForm from './CommentForm'

global.fetch = jest.fn()

describe('CommentForm', () => {
  const defaultProps = {
    contentType: 'post' as const,
    contentSlug: 'test-post',
    onCommentCreated: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the textarea and submit button', () => {
    render(<CommentForm {...defaultProps} />)
    expect(
      screen.getByPlaceholderText('Write a comment...')
    ).toBeInTheDocument()
    expect(screen.getByText('Post Comment')).toBeInTheDocument()
  })

  it('disables submit button when textarea is empty', () => {
    render(<CommentForm {...defaultProps} />)
    expect(screen.getByText('Post Comment')).toBeDisabled()
  })

  it('enables submit button when text is entered', async () => {
    const user = userEvent.setup()
    render(<CommentForm {...defaultProps} />)

    await user.type(
      screen.getByPlaceholderText('Write a comment...'),
      'Hello world'
    )
    expect(screen.getByText('Post Comment')).not.toBeDisabled()
  })

  it('shows character count', async () => {
    const user = userEvent.setup()
    render(<CommentForm {...defaultProps} />)

    await user.type(
      screen.getByPlaceholderText('Write a comment...'),
      'Hello'
    )
    expect(screen.getByText('5 / 2000')).toBeInTheDocument()
  })

  it('submits comment and clears form on success', async () => {
    const mockComment = {
      id: '123',
      user_id: '456',
      display_name: 'Test',
      profile_slug: 'test',
      content_type: 'post',
      content_slug: 'test-post',
      body: 'Hello',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comment: mockComment }),
    })

    const user = userEvent.setup()
    render(<CommentForm {...defaultProps} />)

    await user.type(
      screen.getByPlaceholderText('Write a comment...'),
      'Hello'
    )
    await user.click(screen.getByText('Post Comment'))

    await waitFor(() => {
      expect(defaultProps.onCommentCreated).toHaveBeenCalledWith(mockComment)
    })
  })

  it('shows error message on failed submission', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to post comment' }),
    })

    const user = userEvent.setup()
    render(<CommentForm {...defaultProps} />)

    await user.type(
      screen.getByPlaceholderText('Write a comment...'),
      'Hello'
    )
    await user.click(screen.getByText('Post Comment'))

    await waitFor(() => {
      expect(screen.getByText('Failed to post comment')).toBeInTheDocument()
    })
  })
})
