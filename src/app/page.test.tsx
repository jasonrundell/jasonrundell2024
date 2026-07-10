import { render, screen } from '@testing-library/react'
import Page from './page'

jest.mock('@/lib/content', () => ({
  getFeaturedProjects: jest.fn(),
  getLatestPosts: jest.fn(),
}))

const { getFeaturedProjects, getLatestPosts } = jest.requireMock<{
  getFeaturedProjects: jest.Mock
  getLatestPosts: jest.Mock
}>('@/lib/content')

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

jest.mock('@/components/InfiniteSourcePromo', () => {
  return function MockInfiniteSourcePromo() {
    return <div data-testid="infinite-source">Infinite Source</div>
  }
})

jest.mock('@/components/illustrations/LineArt', () => ({
  HeroIllustration: () => <svg data-testid="hero-illustration" />,
  LoopIllustration: () => <svg data-testid="loop-illustration" />,
  BranchIllustration: () => <svg data-testid="branch-illustration" />,
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

const fakeProjects = [
  { slug: 'p1', title: 'Project 1', createdDate: '2025-01-02', excerpt: 'e1' },
  { slug: 'p2', title: 'Project 2', createdDate: '2025-01-03', excerpt: 'e2' },
  { slug: 'p3', title: 'Project 3', createdDate: '2025-01-01', excerpt: 'e3' },
]

const fakePosts = [
  { slug: 'a', title: 'A', date: '2024-01-01' },
  { slug: 'b', title: 'B', date: '2025-06-01' },
  { slug: 'c', title: 'C', date: '2025-01-01' },
]

describe('Home page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getFeaturedProjects.mockResolvedValue(fakeProjects)
    getLatestPosts.mockResolvedValue(fakePosts)
  })

  it('renders a single h1 with the leadership headline', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/raise the technical bar/i)
  })

  it('renders the primary and secondary hero CTAs', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(
      screen.getAllByRole('link', { name: /book a conversation/i })[0]
    ).toHaveAttribute('href', '/contact')
    expect(
      screen.getByRole('link', { name: /view selected work/i })
    ).toHaveAttribute('href', '/projects')
    expect(
      screen.getByRole('link', { name: /see how i lead/i })
    ).toHaveAttribute('href', '/how-i-lead')
  })

  it('renders proof outcomes and case studies', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(
      screen.getByRole('heading', { name: /proof, not posturing/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/scaled the org/i)).toBeInTheDocument()
  })

  it('renders the Infinite Source promo', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('infinite-source')).toBeInTheDocument()
  })

  it('shows featured projects and latest posts', async () => {
    const pageComponent = await Page()
    render(pageComponent)

    expect(screen.getByTestId('more-projects')).toHaveTextContent('Projects: 3')
    expect(screen.getByTestId('more-posts')).toHaveTextContent('Posts: 3')
  })

  it('fetches projects and posts in parallel with the homepage limits', async () => {
    await Page()

    expect(getFeaturedProjects).toHaveBeenCalledWith(3)
    expect(getLatestPosts).toHaveBeenCalledWith(3)
  })
})
