import { render, screen } from '@testing-library/react'
import AboutPage from './page'

jest.mock('@/lib/content', () => ({
  getSkills: jest.fn(),
  getReferences: jest.fn(),
}))

const { getSkills, getReferences } = jest.requireMock<{
  getSkills: jest.Mock
  getReferences: jest.Mock
}>('@/lib/content')

jest.mock('@/components/Skills', () => {
  return function MockSkills({ skills }: { skills: unknown[] }) {
    return <div data-testid="skills">Skills: {skills.length}</div>
  }
})

jest.mock('@/components/References', () => {
  return function MockReferences({ references }: { references: unknown[] }) {
    return <div data-testid="references">References: {references.length}</div>
  }
})

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

describe('About page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getSkills.mockResolvedValue([{ name: 'A' }, { name: 'B' }])
    getReferences.mockResolvedValue([{ citeName: 'Jane' }])
  })

  it('renders a single h1', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/improver, not a maintainer/i)
  })

  it('renders story, facts, skills and recommendations sections', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    expect(
      screen.getByRole('heading', { name: /how i work/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /the facts/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /what i work in/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('skills')).toHaveTextContent('Skills: 2')
    expect(
      screen.getByRole('heading', { name: /what colleagues say/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('references')).toHaveTextContent('References: 1')
  })

  it('links to Infinite Source and the contact CTA', async () => {
    const pageComponent = await AboutPage()
    render(pageComponent)

    expect(
      screen.getByRole('link', { name: /infinite source/i })
    ).toHaveAttribute('href', 'https://infinitesource.agency')
    expect(
      screen.getByRole('link', { name: /book a conversation/i })
    ).toHaveAttribute('href', '/contact')
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
