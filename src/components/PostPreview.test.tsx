import { render, screen } from '@testing-library/react'
import PostPreview from './PostPreview'

jest.mock('@jasonrundell/dropship', () => ({
  Spacer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Row: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children?: React.ReactNode; level?: number }) => <h2>{children}</h2>,
}))

jest.mock('@/styles/common', () => ({
  StyledLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  StyledHeading: ({ children }: { children?: React.ReactNode }) => <h3>{children}</h3>,
}))

jest.mock('./PostPreviewImage', () =>
  function MockPostPreviewImage({ title }: { title: string }) {
    return <img alt={title} />
  }
)

jest.mock('@/components/chrome/MetaDate', () =>
  function MockMetaDate({ dateString }: { dateString: string }) {
    return <time>{dateString}</time>
  }
)

const baseProps = {
  title: 'Test Post',
  date: '2026-01-01',
  excerpt: 'A short excerpt',
  slug: 'test-post',
}

describe('PostPreview', () => {
  it('renders title linked to post slug', () => {
    render(<PostPreview {...baseProps} />)
    const link = screen.getByRole('link', { name: /test post/i })
    expect(link).toHaveAttribute('href', '/posts/test-post')
  })

  it('renders excerpt text', () => {
    render(<PostPreview {...baseProps} />)
    expect(screen.getByText('A short excerpt')).toBeInTheDocument()
  })

  it('renders date via MetaDate', () => {
    render(<PostPreview {...baseProps} />)
    expect(screen.getByText('2026-01-01')).toBeInTheDocument()
  })

  it('renders image when image prop is provided', () => {
    render(
      <PostPreview
        {...baseProps}
        image={{ file: { url: '/test.webp' } }}
      />
    )
    expect(screen.getByRole('img', { name: /test post/i })).toBeInTheDocument()
  })

  it('does not render image when image prop is absent', () => {
    render(<PostPreview {...baseProps} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
