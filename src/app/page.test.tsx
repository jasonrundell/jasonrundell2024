import { render, screen } from '@testing-library/react'
import Page from './page'

jest.mock('@/lib/contentful', () => ({
  getProjects: jest.fn(),
  getPosts: jest.fn(),
}))

const { getProjects, getPosts } = jest.requireMock<{
  getProjects: jest.Mock
  getPosts: jest.Mock
}>('@/lib/contentful')

jest.mock('@/components/MorePosts', () => {
  return function MockMorePosts({ posts }: { posts: unknown[] }) {
    return <div data-testid="more-posts">Posts: {posts.length}</div>
  }
})

jest.mock('@/components/MoreProjects', () => {
  return function MockMoreProjects({ items }: { items: unknown[] }) {
    return <div data-testid="more-projects">Projects: {items.length}</div>
  }
})

jest.mock('@/components/LastSongWrapper', () => {
  return function MockLastSongWrapper() {
    return <div data-testid="last-song-wrapper">Last Song</div>
  }
})

jest.mock('@/components/HeroTerminal', () => {
  return function MockHeroTerminal({
    heading,
    pitch,
  }: {
    heading: string
    pitch: string
  }) {
    return (
      <section data-testid="hero-terminal" aria-label="Hero">
        <h1>{heading}</h1>
        <p>{pitch}</p>
      </section>
    )
  }
})

jest.mock('@/components/HubDoors', () => {
  return function MockHubDoors({
    doors,
    ariaLabel,
  }: {
    doors: { href: string; label: string }[]
    ariaLabel?: string
  }) {
    return (
      <nav data-testid="hub-doors" aria-label={ariaLabel}>
        {doors.map((d) => (
          <a key={d.href} href={d.href}>
            {d.label}
          </a>
        ))}
      </nav>
    )
  }
})

jest.mock('@/styles/motion', () => ({
  useReveal: () => [{ current: null }, 'ready'],
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  RevealStaggerGroup: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  RevealStaggerItem: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  fadeUpKeyframes: 'mocked-fade-up',
  slideInKeyframes: 'mocked-slide-in',
  typeInKeyframes: 'mocked-type-in',
  REVEAL_FADE_DURATION_MS: 350,
  REVEAL_TYPE_DURATION_MS: 250,
  REVEAL_SLIDE_DURATION_MS: 300,
  REVEAL_STAGGER_INTERVAL_MS: 50,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
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
    const htmlProps = { ...props }
    delete htmlProps.fill
    delete htmlProps.priority
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={typeof src === 'string' ? src : ''}
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
  StyledSection: ({
    children,
    id,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    id?: string
    'aria-label'?: string
  }) => (
    <section data-testid="section" id={id} aria-label={ariaLabel}>
      {children}
    </section>
  ),
  StyledImageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-container">{children}</div>
  ),
}))

const fakeProjects = [
  { slug: 'p1', title: 'Project 1', order: 2, excerpt: 'e1' },
  { slug: 'p2', title: 'Project 2', order: 1, excerpt: 'e2' },
  { slug: 'p3', title: 'Project 3', order: 3, excerpt: 'e3' },
  { slug: 'p4', title: 'Project 4', order: 4, excerpt: 'e4' },
]

const fakePosts = [
  { slug: 'a', title: 'A', date: '2024-01-01' },
  { slug: 'b', title: 'B', date: '2025-06-01' },
  { slug: 'c', title: 'C', date: '2025-01-01' },
  { slug: 'd', title: 'D', date: '2023-01-01' },
]

describe('Home page (hub)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getProjects.mockResolvedValue(fakeProjects)
    getPosts.mockResolvedValue(fakePosts)
  })

  it('renders a single h1 with the role + title (delegated to HeroTerminal)', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/manager \/ full stack developer/i)
  })

  it('renders the hero terminal with the doors nav', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('hero-terminal')).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /site sections/i })
    ).toBeInTheDocument()
  })

  it('renders three door links to /about, /projects, /posts', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'href',
      '/projects'
    )
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute(
      'href',
      '/posts'
    )
  })

  it('renders the LastSong card', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('last-song-wrapper')).toBeInTheDocument()
  })

  it('limits selected projects to three (sorted by order)', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('more-projects')).toHaveTextContent(
      'Projects: 3'
    )
  })

  it('limits latest posts to three (sorted by date desc)', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('more-posts')).toHaveTextContent('Posts: 3')
  })

  it('fetches projects and posts in parallel', async () => {
    await Page()

    expect(getProjects).toHaveBeenCalled()
    expect(getPosts).toHaveBeenCalled()
  })
})
