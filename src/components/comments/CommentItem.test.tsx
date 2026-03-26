import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentItem from './CommentItem'
import type { Comment } from '@/typeDefinitions/app'

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}))

global.fetch = jest.fn()

const mockComment: Comment = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  user_id: 'user-1',
  display_name: 'Test User',
  profile_slug: 'test-user',
  content_type: 'post',
  content_slug: 'test-post',
  body: 'This is a test comment',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

describe('CommentItem', () => {
  const defaultProps = {
    comment: mockComment,
    currentUserId: null as string | null,
    isAdmin: false,
    onUpdated: jest.fn(),
    onDeleted: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders comment body as plain text', () => {
    render(<CommentItem {...defaultProps} />)
    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
  })

  it('renders display name as a link to profile', () => {
    render(<CommentItem {...defaultProps} />)
    const link = screen.getByText('Test User')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/u/test-user')
  })

  it('renders relative timestamp', () => {
    render(<CommentItem {...defaultProps} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('does not show edit/delete buttons for unauthenticated users', () => {
    render(<CommentItem {...defaultProps} />)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('does not show edit/delete buttons for non-owner non-admin users', () => {
    render(
      <CommentItem {...defaultProps} currentUserId="other-user" />
    )
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('shows edit and delete buttons for comment owner', () => {
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('shows only delete button for admin (non-owner)', () => {
    render(
      <CommentItem
        {...defaultProps}
        currentUserId="admin-user"
        isAdmin={true}
      />
    )
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('shows edit and delete for admin who is also the owner', () => {
    render(
      <CommentItem
        {...defaultProps}
        currentUserId="user-1"
        isAdmin={true}
      />
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('shows delete confirmation when delete is clicked', async () => {
    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Delete'))
    expect(screen.getByText('Delete this comment?')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('cancels delete confirmation', async () => {
    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Delete'))
    await user.click(screen.getByText('No'))
    expect(screen.queryByText('Delete this comment?')).not.toBeInTheDocument()
  })

  it('calls onDeleted after successful deletion', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
    })

    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Delete'))
    await user.click(screen.getByText('Yes'))

    await waitFor(() => {
      expect(defaultProps.onDeleted).toHaveBeenCalledWith(mockComment.id)
    })
  })

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Edit'))
    expect(screen.getByDisplayValue('This is a test comment')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('cancels edit mode', async () => {
    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Edit'))
    await user.click(screen.getByText('Cancel'))
    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })

  it('calls onUpdated after successful edit', async () => {
    const updatedComment = { ...mockComment, body: 'Updated body' }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comment: updatedComment }),
    })

    const user = userEvent.setup()
    render(<CommentItem {...defaultProps} currentUserId="user-1" />)

    await user.click(screen.getByText('Edit'))
    const textarea = screen.getByDisplayValue('This is a test comment')
    await user.clear(textarea)
    await user.type(textarea, 'Updated body')
    await user.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(defaultProps.onUpdated).toHaveBeenCalledWith(updatedComment)
    })
  })

  it('renders body with XSS content as plain text (no HTML)', () => {
    const xssComment = {
      ...mockComment,
      body: '<script>alert("xss")</script>',
    }
    render(<CommentItem {...defaultProps} comment={xssComment} />)

    const bodyElement = screen.getByText('<script>alert("xss")</script>')
    expect(bodyElement.innerHTML).not.toContain('<script>')
    expect(bodyElement.textContent).toBe('<script>alert("xss")</script>')
  })

  it('does not display email anywhere', () => {
    render(<CommentItem {...defaultProps} />)
    const container = screen.getByText('This is a test comment').closest('div')
    expect(container?.textContent).not.toContain('@')
  })
})
