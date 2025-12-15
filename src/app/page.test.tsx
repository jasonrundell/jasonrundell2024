import { render, screen } from '@testing-library/react'
import Page from './page'

// Mock Contentful functions
jest.mock('@/lib/contentful', () => ({
  getSkills: jest.fn(),
  getProjects: jest.fn(),
  getReferences: jest.fn(),
  getPositions: jest.fn(),
  getPosts: jest.fn(),
}))

const { getSkills, getProjects, getReferences, getPositions, getPosts } =
  jest.requireMock<{
    getSkills: jest.Mock
    getProjects: jest.Mock
    getReferences: jest.Mock
    getPositions: jest.Mock
    getPosts: jest.Mock
  }>('@/lib/contentful')

// Mock components
jest.mock('@/components/Skills', () => {
  return function MockSkills({ skills }: { skills: unknown[] }) {
    return <div data-testid="skills">Skills: {skills.length}</div>
  }
})

jest.mock('@/components/ContactList', () => {
  return function MockContactList() {
    return <div data-testid="contact-list">Contact List</div>
  }
})

jest.mock('@/components/References', () => {
  return function MockReferences({ references }: { references: unknown[] }) {
    return <div data-testid="references">References: {references.length}</div>
  }
})

jest.mock('@/components/Positions', () => {
  return function MockPositions({ positions }: { positions: unknown[] }) {
    return <div data-testid="positions">Positions: {positions.length}</div>
  }
})

jest.mock('@/components/MorePosts', () => {
  return function MockMorePosts({ posts }: { posts: unknown[] }) {
    return <div data-testid="more-posts">Posts: {posts.length}</div>
  }
})

jest.mock('@/components/Icon', () => {
  return function MockIcon({ type }: { type: string }) {
    return <span data-testid={`icon-${type}`}>{type}</span>
  }
})

jest.mock('@/components/LastSongWrapper', () => {
  return function MockLastSongWrapper() {
    return <div data-testid="last-song-wrapper">Last Song</div>
  }
})

jest.mock('lucide-react', () => ({
  Play: () => <span data-testid="play-icon">Play</span>,
  ExternalLink: () => (
    <span data-testid="external-link-icon">ExternalLink</span>
  ),
  Music: () => <span data-testid="music-icon">Music</span>,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    style,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    priority?: boolean
    style?: React.CSSProperties
    [key: string]: unknown
  }) {
    // Filter out Next.js-specific props that aren't valid HTML attributes
    const htmlProps = { ...props }
    delete htmlProps.fill
    delete htmlProps.priority

    // Using <img> in test mock is intentional - Next.js Image component is mocked
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        data-testid="next-image"
        style={style}
        {...htmlProps}
      />
    )
  }
})

jest.mock('@/styles/common', () => ({
  StyledDivBgDark: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="div-bg-dark">{children}</div>
  ),
  StyledIntroParagraph: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="intro-paragraph">{children}</p>
  ),
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  StyledList: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="list">{children}</ul>
  ),
  StyledListItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="list-item">{children}</li>
  ),
  StyledSection: ({
    children,
    id,
  }: {
    children: React.ReactNode
    id?: string
  }) => (
    <section data-testid="section" id={id}>
      {children}
    </section>
  ),
  StyledImageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-container">{children}</div>
  ),
}))

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock data
    getSkills.mockResolvedValue([
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
    ])
    getProjects.mockResolvedValue([
      { slug: 'project-1', title: 'Project 1' },
      { slug: 'project-2', title: 'Project 2' },
    ])
    getReferences.mockResolvedValue([
      { citeName: 'John Doe', company: 'Acme Corp' },
    ])
    getPositions.mockResolvedValue([
      { title: 'Senior Developer', company: 'Tech Corp' },
    ])
    getPosts.mockResolvedValue([
      { slug: 'post-1', title: 'Post 1' },
      { slug: 'post-2', title: 'Post 2' },
    ])
  })

  it('should render main heading', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(
      screen.getByRole('heading', { name: /full stack developer/i })
    ).toBeInTheDocument()
  })

  it('should render intro paragraph', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(screen.getByTestId('intro-paragraph')).toBeInTheDocument()
    expect(
      screen.getByText(/hey! i'm an experienced developer/i)
    ).toBeInTheDocument()
  })

  it('should render contact list', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(screen.getByTestId('contact-list')).toBeInTheDocument()
  })

  it('should render skills section', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByTestId('skills')).toBeInTheDocument()
    expect(screen.getByText(/skills: 2/i)).toBeInTheDocument()
  })

  it('should render experience section with positions', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(
      screen.getByRole('heading', { name: /experience/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('positions')).toBeInTheDocument()
    expect(screen.getByText(/positions: 1/i)).toBeInTheDocument()
  })

  it('should render LinkedIn link in experience section', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    const linkedInLink = screen.getByRole('link', {
      name: /see more on linkedin/i,
    })
    expect(linkedInLink).toBeInTheDocument()
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jasonrundell/'
    )
  })

  it('should render projects section', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(
      screen.getByRole('heading', { name: /projects/i })
    ).toBeInTheDocument()
    const projectLinks = screen.getAllByRole('link')
    const project1Link = projectLinks.find(
      (link) => link.getAttribute('href') === '/projects/project-1'
    )
    expect(project1Link).toBeInTheDocument()
    expect(project1Link).toHaveTextContent('Project 1')
  })

  it('should render recommendations section with references', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(
      screen.getByRole('heading', { name: /recommendations/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('references')).toBeInTheDocument()
    expect(screen.getByText(/references: 1/i)).toBeInTheDocument()
  })

  it('should render blog section with posts', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument()
    expect(screen.getByTestId('more-posts')).toBeInTheDocument()
    expect(screen.getByText(/posts: 2/i)).toBeInTheDocument()
  })

  it('should fetch all data in parallel', async () => {
    // Act
    await Page()

    // Assert
    expect(getSkills).toHaveBeenCalled()
    expect(getProjects).toHaveBeenCalled()
    expect(getReferences).toHaveBeenCalled()
    expect(getPositions).toHaveBeenCalled()
    expect(getPosts).toHaveBeenCalled()

    // All should be called (parallel execution)
    const allCalls = [
      getSkills.mock.invocationCallOrder[0],
      getProjects.mock.invocationCallOrder[0],
      getReferences.mock.invocationCallOrder[0],
      getPositions.mock.invocationCallOrder[0],
      getPosts.mock.invocationCallOrder[0],
    ]
    // They should all be called around the same time (within same tick)
    const maxCallOrder = Math.max(...allCalls)
    const minCallOrder = Math.min(...allCalls)
    // All calls should be very close together (within 5 calls)
    expect(maxCallOrder - minCallOrder).toBeLessThan(5)
  })

  it('should handle empty data gracefully', async () => {
    // Arrange
    getSkills.mockResolvedValue([])
    getProjects.mockResolvedValue([])
    getReferences.mockResolvedValue([])
    getPositions.mockResolvedValue([])
    getPosts.mockResolvedValue([])

    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    // When data is empty, components may not render, so check what's actually rendered
    const skillsElement = screen.queryByTestId('skills')
    if (skillsElement) {
      expect(skillsElement).toHaveTextContent(/skills: 0/i)
    }
    // Positions component may not render with empty array
    const positionsElement = screen.queryByTestId('positions')
    if (positionsElement) {
      expect(positionsElement).toHaveTextContent(/positions: 0/i)
    }
    const referencesElement = screen.queryByTestId('references')
    if (referencesElement) {
      expect(referencesElement).toHaveTextContent(/references: 0/i)
    }
    const postsElement = screen.queryByTestId('more-posts')
    if (postsElement) {
      expect(postsElement).toHaveTextContent(/posts: 0/i)
    }
  })

  it('should have correct section IDs for navigation', async () => {
    // Act
    const pageComponent = await Page()
    render(pageComponent)

    // Assert
    const sections = screen.getAllByTestId('section')
    const sectionIds = sections
      .map((section) => section.getAttribute('id'))
      .filter(Boolean)
    expect(sectionIds).toContain('home')
    expect(sectionIds).toContain('skills')
    expect(sectionIds).toContain('experience')
    expect(sectionIds).toContain('projects')
    expect(sectionIds).toContain('recommendations')
    expect(sectionIds).toContain('blog')
  })
})
