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

describe('Contact page', () => {
  it('renders a single h1', () => {
    render(<ContactPage />)

    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(/book a conversation/i)
  })

  it('renders the intro guidance for reaching out', () => {
    render(<ContactPage />)

    expect(
      screen.getByText(/The fastest way to reach me is email/i)
    ).toBeInTheDocument()
  })

  it('renders an email contact link', () => {
    render(<ContactPage />)

    expect(
      screen.getByRole('link', { name: /contact@jasonrundell\.com/i })
    ).toHaveAttribute('href', 'mailto:contact@jasonrundell.com')
  })

  it('renders the three ways to work together', () => {
    render(<ContactPage />)

    expect(
      screen.getByRole('heading', { name: /full-time leadership/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /fractional cto/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /selective hands-on builds/i })
    ).toBeInTheDocument()
  })
})
