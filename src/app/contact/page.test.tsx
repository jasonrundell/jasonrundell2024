import { render, screen } from '@testing-library/react'
import ContactPage from './page'

jest.mock('@/components/ContactList', () => {
  return function MockContactList() {
    return <div data-testid="contact-list">Contact List</div>
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

describe('Contact page', () => {
  it('renders a single h1', () => {
    render(<ContactPage />)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/contact me/i)
  })

  it('renders the contact list', () => {
    render(<ContactPage />)

    expect(screen.getByTestId('contact-list')).toBeInTheDocument()
  })

  it('renders a breadcrumb to home', () => {
    render(<ContactPage />)

    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
