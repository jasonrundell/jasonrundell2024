import { act, fireEvent, render, screen } from '@/__tests__/utils/test-utils'

import BackToTop from './BackToTop'
import ContactList from './ContactList'
import ContentDate from './ContentDate'
import HeadingAnimation from './HeadingAnimation'
import MorePosts from './MorePosts'
import MoreProjects from './MoreProjects'
import Positions from './Positions'
import PostAuthor from './PostAuthor'
import PostHeader from './PostHeader'
import PostImage from './PostImage'
import PostPreview from './PostPreview'
import PostPreviewImage from './PostPreviewImage'
import ProjectPreview from './ProjectPreview'
import ProjectPreviewImage from './ProjectPreviewImage'
import References from './References'
import Skills from './Skills'

jest.mock('@jasonrundell/dropship', () => ({
  Blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote>{children}</blockquote>
  ),
  Grid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid">{children}</div>
  ),
  Heading: ({
    children,
    level = 1,
  }: {
    children: React.ReactNode
    level?: number
  }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return <Tag>{children}</Tag>
  },
  Row: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="row">{children}</div>
  ),
  Spacer: () => <div data-testid="spacer" />,
}))

jest.mock('lucide-react', () => ({
  ExternalLink: () => <span data-testid="external-link-icon" />,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock('./ContentImage', () => {
  return function MockContentImage({
    alt,
    src,
  }: {
    alt?: string
    src: string
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt ?? ''} src={src} />
  }
})

jest.mock('./Icon', () => {
  return function MockIcon({ type }: { type: string }) {
    return <span data-testid={`icon-${type}`} />
  }
})

describe('content display components', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders a formatted date', () => {
    render(<ContentDate dateString="2025-01-15T12:00:00.000Z" />)

    expect(screen.getByText(/January\s+15, 2025/)).toHaveAttribute(
      'datetime',
      '2025-01-15T12:00:00.000Z'
    )
  })

  it('renders contact links with accessible labels', () => {
    render(<ContactList />)

    expect(
      screen.getByRole('link', { name: /contact@jasonrundell\.com/i })
    ).toHaveAttribute('href', 'mailto:contact@jasonrundell.com')
    expect(
      screen.getByRole('link', { name: /book time with me/i })
    ).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    )
    expect(
      screen.getByRole('link', { name: /linkedin/i })
    ).toBeInTheDocument()
  })

  it('renders unique position companies once', () => {
    render(
      <Positions
        positions={[
          { id: '1', company: 'Acme', role: 'Dev', orderId: 1, startDate: '', endDate: '' },
          { id: '2', company: 'Acme', role: 'Lead', orderId: 2, startDate: '', endDate: '' },
          { id: '3', company: 'Globex', role: 'Dev', orderId: 3, startDate: '', endDate: '' },
        ]}
      />
    )

    expect(screen.getAllByText('Acme')).toHaveLength(1)
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('renders skills as a capability matrix grouped by category', () => {
    render(
      <Skills
        skills={[
          { id: '1', category: 'Frontend', name: 'React' },
          { id: '2', category: 'Frontend', name: 'TypeScript' },
          { id: '3', category: 'Backend', name: 'Supabase' },
        ]}
      />
    )

    expect(screen.getByLabelText('Capability matrix')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Supabase')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Backend' })).toBeInTheDocument()

    const frontendList = screen.getByRole('list', { name: 'Frontend' })
    expect(frontendList).toBeInTheDocument()
    expect(frontendList.querySelectorAll('li')).toHaveLength(2)
  })

  it('throws when skills data is missing', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    expect(() => render(<Skills skills={[]} />)).toThrow(
      'Skills data is required.'
    )
    consoleError.mockRestore()
  })

  it('renders references and rejects missing reference data', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(
      <References
        references={[
          {
            id: '1',
            citeName: 'Jane Doe',
            company: 'Acme',
            order: 1,
            emphasis: true,
            quote: 'Great collaborator.',
          },
        ]}
      />
    )

    expect(screen.getByLabelText('Reference testimonials')).toBeInTheDocument()
    expect(screen.getByText('Great collaborator.')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()

    const { container: multilineContainer } = render(
      <References
        references={[
          {
            id: '2',
            citeName: 'John Smith',
            company: 'Example Co.',
            order: 2,
            emphasis: false,
            quote: 'First paragraph.\n\nSecond paragraph.',
          },
        ]}
      />
    )

    expect(multilineContainer.querySelectorAll('p')).toHaveLength(2)
    expect(screen.getByText(/First paragraph\./)).toBeInTheDocument()
    expect(screen.getByText(/Second paragraph\./)).toBeInTheDocument()

    expect(() => render(<References references={[]} />)).toThrow(
      'References data is required.'
    )
    consoleError.mockRestore()
  })

  it('renders post preview content with and without images', () => {
    const postProps = {
      title: 'AI Development Notes',
      image: { file: { url: '/content/posts/ai-development-notes/featured.webp' } },
      date: '2025-01-15T00:00:00.000Z',
      excerpt: 'How the workflow fits together.',
      slug: 'ai-development-notes',
    }

    const { rerender } = render(<PostPreview {...postProps} />)

    expect(screen.getAllByRole('link', { name: 'AI Development Notes' }))
      .toHaveLength(2)
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      '/content/posts/ai-development-notes/featured.webp'
    )
    expect(screen.getByText('How the workflow fits together.')).toBeInTheDocument()

    rerender(<PostPreview {...postProps} image={undefined as never} />)

    expect(screen.queryByAltText('')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'AI Development Notes' }))
      .toHaveAttribute('href', '/posts/ai-development-notes')
  })

  it('renders project preview content and image links', () => {
    render(
      <ProjectPreview
        title="Matter Ops"
        image={{ file: { url: '/content/projects/matter-ops/featured.webp' } }}
        slug="matter-ops"
        excerpt="An operational dashboard."
      />
    )

    expect(screen.getAllByRole('link', { name: 'Matter Ops' })).toHaveLength(2)
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      '/content/projects/matter-ops/featured.webp'
    )
    expect(screen.getByText('An operational dashboard.')).toBeInTheDocument()
  })

  it('renders post and project preview lists', () => {
    render(
      <>
        <MorePosts
          posts={[
            {
              title: 'First Post',
              slug: 'first-post',
              date: '2025-01-15T00:00:00.000Z',
              excerpt: 'Post excerpt',
              content: '',
              author: 'Jason Rundell',
              featuredImage: { src: '/content/posts/first-post/featured.webp', alt: 'First post image' },
            },
          ]}
        />
        <MoreProjects
          items={[
            {
              title: 'First Project',
              slug: 'first-project',
              excerpt: 'Project excerpt',
              featuredImage: {
                file: { url: '/content/projects/first-project/featured.webp' },
                altText: 'Project image',
                description: 'Project image description',
              },
            },
          ]}
        />
      </>
    )

    expect(screen.getAllByRole('link', { name: 'First Post' })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: 'First Project' })).toHaveLength(2)
  })

  it('wraps post and project images in the correct route when slug is provided', () => {
    render(
      <>
        <PostImage
          title="Post detail"
          url="/content/posts/post-detail/featured.webp"
          slug="post-detail"
          altText="Detail image"
        />
        <PostPreviewImage
          title="Post preview"
          url="/content/posts/post-preview/featured.webp"
          slug="post-preview"
          altText="Preview image"
        />
        <ProjectPreviewImage
          title="Project preview"
          url="/content/projects/project-preview/featured.webp"
          slug="project-preview"
        />
      </>
    )

    expect(screen.getByLabelText('Post detail')).toHaveAttribute(
      'href',
      '/posts/post-detail'
    )
    expect(screen.getByLabelText('Post preview')).toHaveAttribute(
      'href',
      '/posts/post-preview'
    )
    expect(screen.getByLabelText('Project preview')).toHaveAttribute(
      'href',
      '/projects/project-preview'
    )
  })

  it('renders author and post header metadata', () => {
    render(
      <>
        <PostAuthor
          name="Jason Rundell"
          date="2025-01-15T00:00:00.000Z"
        />
        <PostHeader
          post={{
            title: 'Post Header Title',
            slug: 'post-header-title',
            date: '2025-01-15T00:00:00.000Z',
            content: '',
            excerpt: '',
            author: 'Post Author',
            featuredImage: {
              src: '/content/posts/post-header-title/featured.webp',
              alt: 'Post image alt',
              description: 'A useful image description',
            },
          }}
        />
      </>
    )

    expect(screen.getByText('By: Jason Rundell')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Post Header Title' })).toBeInTheDocument()
    expect(screen.getByText('A useful image description')).toBeInTheDocument()
    expect(screen.getByText('By: Post Author')).toBeInTheDocument()
  })

  it('advances heading animation until the last step while keeping a stable accessible name', () => {
    jest.useFakeTimers()

    render(<HeadingAnimation steps={['J', 'Ja', 'Jason']} speed={100} />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'J' })
    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveAttribute('aria-label', 'J')
    expect(screen.getByText('J')).toHaveAttribute('aria-hidden', 'true')

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(screen.getByRole('link', { name: 'J' })).toBeInTheDocument()
    expect(screen.getByText('Ja')).toHaveAttribute('aria-hidden', 'true')

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(screen.getByRole('link', { name: 'J' })).toBeInTheDocument()
    expect(screen.getByText('Jason')).toHaveAttribute('aria-hidden', 'true')

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(screen.getByRole('link', { name: 'J' })).toBeInTheDocument()
    expect(screen.getByText('Jason')).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses the explicit ariaLabel prop when provided so consumers control the accessible name', () => {
    render(
      <HeadingAnimation
        steps={['J', 'Ja', 'Jason']}
        speed={100}
        ariaLabel="Jason Rundell home"
      />
    )

    const link = screen.getByRole('link', { name: 'Jason Rundell home' })
    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveAttribute('aria-label', 'Jason Rundell home')
  })

  it('scrolls back to top by click and keyboard activation', () => {
    const scrollTo = jest.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true })

    render(<BackToTop />)

    fireEvent.scroll(window)
    const button = screen.getByRole('button', { name: 'Back to top' })

    fireEvent.click(button)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyDown(button, { key: ' ' })
    expect(scrollTo).toHaveBeenCalledTimes(3)
  })
})
