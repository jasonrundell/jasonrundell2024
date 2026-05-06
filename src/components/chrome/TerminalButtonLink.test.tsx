import { render, screen } from '@testing-library/react'
import TerminalButtonLink from './TerminalButtonLink'

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

describe('TerminalButtonLink', () => {
  it('renders an anchor pointing at href with the label as accessible name', () => {
    render(<TerminalButtonLink href="/projects" label="Projects" />)

    const link = screen.getByRole('link', { name: 'Projects' })
    expect(link).toHaveAttribute('href', '/projects')
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(
      <TerminalButtonLink
        href="/about"
        label="About"
        description="Bio, skills, experience."
      />
    )

    expect(screen.getByText('Bio, skills, experience.')).toBeInTheDocument()
  })

  it('omits the description node when no description is provided', () => {
    render(<TerminalButtonLink href="/posts" label="Blog" />)

    expect(screen.queryByText(/bio/i)).not.toBeInTheDocument()
  })

  it('honors an explicit aria-label override', () => {
    render(
      <TerminalButtonLink
        href="/contact"
        label="Contact"
        aria-label="Open the contact page"
      />
    )

    expect(
      screen.getByRole('link', { name: 'Open the contact page' })
    ).toHaveAttribute('href', '/contact')
  })
})
