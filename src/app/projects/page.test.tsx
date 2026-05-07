import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

jest.mock('@/lib/content', () => ({
  getProjects: jest.fn(),
}))

const { getProjects } = jest.requireMock<{
  getProjects: jest.Mock
}>('@/lib/content')

jest.mock('@/components/MoreProjects', () => {
  return function MockMoreProjects({
    items,
  }: {
    items: { slug: string; title: string }[]
  }) {
    return (
      <div data-testid="more-projects">
        {items.map((item) => (
          <span key={item.slug} data-testid="project-item">
            {item.title}
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

describe('Projects page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getProjects.mockResolvedValue([
      { slug: 'b', title: 'B', createdDate: '2025-01-02', excerpt: 'eb' },
      { slug: 'a', title: 'A', createdDate: '2025-01-03', excerpt: 'ea' },
      { slug: 'c', title: 'C', createdDate: '2025-01-01', excerpt: 'ec' },
    ])
  })

  it('renders a single h1 with the page title', async () => {
    const pageComponent = await ProjectsPage()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/^projects$/i)
  })

  it('renders all projects sorted by date descending', async () => {
    const pageComponent = await ProjectsPage()
    render(pageComponent)

    const items = screen.getAllByTestId('project-item')
    expect(items.map((el) => el.textContent)).toEqual(['A', 'B', 'C'])
  })

  it('renders a breadcrumb to home', async () => {
    const pageComponent = await ProjectsPage()
    render(pageComponent)

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
