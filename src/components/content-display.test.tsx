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

jest.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: (document: { text?: string }) => document.text,
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

jest.mock('./ContentfulImage', () => {
  return function MockContentfulImage({
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

const imageFields = {
  file: {
    fields: {
      file: {
        url: 'https://images.ctfassets.net/post-image.jpg',
      },
    },
  },
  altText: 'Post image alt',
  description: 'A useful image description',
}

describe('content display components', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders a formatted Contentful date', () => {
    render(<ContentDate dateString="2025-01-15T12:00:00.000Z" />)

    expect(screen.getByText(/January\s+15, 2025/)).toHaveAttribute(
      'datetime',
      '2025-01-15T12:00:00.000Z'
    )
  })

  it('renders contact links with accessible labels', () => {
    render(<ContactList />)

    expect(screen.getByLabelText('Email me')).toHaveAttribute(
      'href',
      'mailto:contact@jasonrundell.com'
    )
    expect(screen.getByLabelText('Book time with me')).toHaveAttribute(
      'target',
      '_blank'
    )
    expect(screen.getByLabelText('My open-source work on GitHub')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    )
    expect(screen.getByLabelText('Connect on LinkedIn')).toBeInTheDocument()
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

  it('groups skills by category', () => {
    render(
      <Skills
        skills={[
          { id: '1', category: 'Frontend', name: 'React' },
          { id: '2', category: 'Frontend', name: 'TypeScript' },
          { id: '3', category: 'Backend', name: 'Supabase' },
        ]}
      />
    )

    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Backend' })).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Supabase')).toBeInTheDocument()
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
            quote: { text: 'Great collaborator.' } as never,
          },
        ]}
      />
    )

    expect(screen.getByLabelText('Reference testimonials')).toBeInTheDocument()
    expect(screen.getByText('Great collaborator.')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()

    expect(() => render(<References references={[]} />)).toThrow(
      'References data is required.'
    )
    consoleError.mockRestore()
  })

  it('renders post preview content with and without images', () => {
    const postProps = {
      title: 'AI Development Notes',
      image: { file: { url: 'https://images.ctfassets.net/post.jpg' } },
      date: '2025-01-15T00:00:00.000Z',
      excerpt: 'How the workflow fits together.',
      slug: 'ai-development-notes',
    }

    const { rerender } = render(<PostPreview {...postProps} />)

    expect(screen.getAllByRole('link', { name: 'AI Development Notes' }))
      .toHaveLength(2)
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      'https://images.ctfassets.net/post.jpg'
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
        image={{ file: { url: 'https://images.ctfassets.net/project.jpg' } }}
        slug="matter-ops"
        excerpt="An operational dashboard."
      />
    )

    expect(screen.getAllByRole('link', { name: 'Matter Ops' })).toHaveLength(2)
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      'https://images.ctfassets.net/project.jpg'
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
              featuredImage: { fields: { file: { fields: { file: { url: 'post.jpg' } } } } },
            } as never,
          ]}
        />
        <MoreProjects
          items={[
            {
              title: 'First Project',
              slug: 'first-project',
              excerpt: 'Project excerpt',
              featuredImage: {
                file: { url: 'project.jpg' },
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
          url="https://images.ctfassets.net/detail.jpg"
          slug="post-detail"
          altText="Detail image"
        />
        <PostPreviewImage
          title="Post preview"
          url="https://images.ctfassets.net/preview.jpg"
          slug="post-preview"
          altText="Preview image"
        />
        <ProjectPreviewImage
          title="Project preview"
          url="https://images.ctfassets.net/project-preview.jpg"
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
          picture={{ url: 'https://images.ctfassets.net/avatar.jpg' }}
          date="2025-01-15T00:00:00.000Z"
        />
        <PostHeader
          post={
            {
              title: 'Post Header Title',
              date: '2025-01-15T00:00:00.000Z',
              featuredImage: { fields: imageFields },
              author: {
                fields: {
                  name: 'Post Author',
                  picture: {
                    fields: {
                      file: { url: 'https://images.ctfassets.net/author.jpg' },
                    },
                  },
                },
              },
            } as never
          }
        />
      </>
    )

    expect(screen.getByText('By: Jason Rundell')).toBeInTheDocument()
    expect(screen.getByAltText('Jason Rundell')).toHaveAttribute(
      'src',
      'https://images.ctfassets.net/avatar.jpg'
    )
    expect(screen.getByRole('heading', { name: 'Post Header Title' })).toBeInTheDocument()
    expect(screen.getByText('A useful image description')).toBeInTheDocument()
    expect(screen.getByText('By: Post Author')).toBeInTheDocument()
  })

  it('advances heading animation until the last step while keeping a stable accessible name', () => {
    jest.useFakeTimers()

    render(<HeadingAnimation steps={['J', 'Ja', 'Jason']} speed={100} />)

    // The link's accessible name is stable across ticks (defaults to steps[0])
    // so screen readers do not announce every typewriter frame.
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
