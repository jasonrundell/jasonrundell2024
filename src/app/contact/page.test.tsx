import { render, screen } from '@testing-library/react'
import ContactPage from './page'

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

describe('Contact page', () => {
  it('renders a single h1', () => {
    render(<ContactPage />)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/contact me/i)
  })

  it('renders the intro guidance for reaching out', () => {
    render(<ContactPage />)

    expect(
      screen.getByText(
        /The fastest way to reach me is email\. For longer conversations, book time on the calendar or connect on LinkedIn\./
      )
    ).toBeInTheDocument()
  })

  it('renders a breadcrumb to home', () => {
    render(<ContactPage />)

    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
