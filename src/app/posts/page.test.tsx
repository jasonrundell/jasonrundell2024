import { render, screen } from '@testing-library/react'
import PostsPage from './page'

jest.mock('@/lib/contentful', () => ({
  getPosts: jest.fn(),
}))

const { getPosts } = jest.requireMock<{
  getPosts: jest.Mock
}>('@/lib/contentful')

jest.mock('@/components/MorePosts', () => {
  return function MockMorePosts({
    posts,
  }: {
    posts: { slug: string; title: string }[]
  }) {
    return (
      <div data-testid="more-posts">
        {posts.map((p) => (
          <span key={p.slug} data-testid="post-item">
            {p.title}
          </span>
        ))}
      </div>
    )
  }
})

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

jest.mock('@/styles/common', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
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
  StyledBreadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="breadcrumb" aria-label="Breadcrumb">
      {children}
    </nav>
  ),
}))

describe('Posts page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getPosts.mockResolvedValue([
      { slug: 'old', title: 'Old', date: '2023-01-01' },
      { slug: 'new', title: 'New', date: '2025-06-01' },
      { slug: 'mid', title: 'Mid', date: '2024-06-01' },
    ])
  })

  it('renders a single h1 with the Blog title', async () => {
    const pageComponent = await PostsPage()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/^blog$/i)
  })

  it('renders posts sorted by date descending', async () => {
    const pageComponent = await PostsPage()
    render(pageComponent)

    const items = screen.getAllByTestId('post-item')
    expect(items.map((el) => el.textContent)).toEqual(['New', 'Mid', 'Old'])
  })
})
