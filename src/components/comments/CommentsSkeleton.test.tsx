import { render, screen } from '@testing-library/react'

jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

import CommentsSkeleton from './CommentsSkeleton'

describe('CommentsSkeleton', () => {
  it('renders the Comments heading', () => {
    render(<CommentsSkeleton />)
    expect(screen.getByText('Comments')).toBeInTheDocument()
  })

  it('has accessible loading status role', () => {
    render(<CommentsSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible loading label', () => {
    render(<CommentsSkeleton />)
    expect(
      screen.getByLabelText('Loading comments')
    ).toBeInTheDocument()
  })

  it('renders skeleton comment cards', () => {
    const { container } = render(<CommentsSkeleton />)
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]')
    expect(hiddenElements.length).toBeGreaterThanOrEqual(3)
  })
})
