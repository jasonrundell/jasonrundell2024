import { render, screen } from '@testing-library/react'
import AboutPage from './page'

jest.mock('@/lib/contentful', () => ({
  getSkills: jest.fn(),
  getReferences: jest.fn(),
  getPositions: jest.fn(),
}))

const { getSkills, getReferences, getPositions } = jest.requireMock<{
  getSkills: jest.Mock
  getReferences: jest.Mock
  getPositions: jest.Mock
}>('@/lib/contentful')

jest.mock('@/components/Skills', () => {
  return function MockSkills({ skills }: { skills: unknown[] }) {
    return <div data-testid="skills">Skills: {skills.length}</div>
  }
})

jest.mock('@/components/Positions', () => {
  return function MockPositions({ positions }: { positions: unknown[] }) {
    return <div data-testid="positions">Positions: {positions.length}</div>
  }
})

jest.mock('@/components/References', () => {
  return function MockReferences({ references }: { references: unknown[] }) {
    return <div data-testid="references">References: {references.length}</div>
  }
})

jest.mock('@/components/Icon', () => {
  return function MockIcon({ type }: { type: string }) {
    return <span data-testid={`icon-${type}`}>{type}</span>
  }
})

jest.mock('lucide-react', () => ({
  ExternalLink: () => (
    <span data-testid="external-link-icon">ExternalLink</span>
  ),
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

jest.mock('@/styles/common', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  StyledIntroParagraph: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="intro-paragraph">{children}</p>
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
  StyledLink: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  StyledBreadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="breadcrumb" aria-label="Breadcrumb">
      {children}
    </nav>
  ),
}))

describe('About page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getSkills.mockResolvedValue([{ name: 'A' }, { name: 'B' }])
    getPositions.mockResolvedValue([{ company: 'Acme' }])
    getReferences.mockResolvedValue([{ citeName: 'Jane' }])
  })

  it('renders a single h1 about Jason', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/about jason rundell/i)
  })

  it('renders intro, skills, experience and recommendations sections', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    expect(screen.getByTestId('intro-paragraph')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^skills$/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('skills')).toHaveTextContent('Skills: 2')
    expect(
      screen.getByRole('heading', { name: /^experience$/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('positions')).toHaveTextContent('Positions: 1')
    expect(
      screen.getByRole('heading', { name: /^recommendations$/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('references')).toHaveTextContent('References: 1')
  })

  it('includes a LinkedIn link in the experience section', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    const linkedinLink = screen.getByRole('link', {
      name: /see more on linkedin/i,
    })
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jasonrundell/'
    )
  })

  it('renders Person JSON-LD structured data', async () => {
    const pageComponent = await AboutPage()
    const { container } = render(pageComponent)

    const ld = container.querySelector('script[type="application/ld+json"]')
    expect(ld).toBeInTheDocument()

    const parsed = JSON.parse(ld?.textContent ?? '{}')
    expect(parsed['@type']).toBe('Person')
    expect(parsed.name).toBe('Jason Rundell')
    expect(parsed.sameAs).toEqual(
      expect.arrayContaining([
        'https://www.linkedin.com/in/jasonrundell/',
        'https://github.com/jasonrundell',
      ])
    )
  })
})
