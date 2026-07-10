import { render, screen } from '@testing-library/react'
import MainNav from './MainNav'

// Mock dependencies
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

jest.mock('./MainNavClient', () => {
  return function MockMainNavClient() {
    return <div data-testid="main-nav-client">Nav Client</div>
  }
})

describe('MainNav Component', () => {
  it('should render navigation container', () => {
    // Act
    render(<MainNav />)

    // Assert
    const navContainer = document.getElementById('menu')
    expect(navContainer).toBeInTheDocument()
  })

  it('should render desktop navigation with aria-label', () => {
    // Act
    render(<MainNav />)

    // Assert
    const navs = screen.getAllByLabelText('Main Navigation')
    expect(navs.length).toBeGreaterThan(0)
    // Desktop nav should be present
    expect(navs[0]).toBeInTheDocument()
  })

  it('should render mobile navigation with aria-label', () => {
    // Act
    render(<MainNav />)

    // Assert
    const navs = screen.getAllByLabelText('Main Navigation')
    expect(navs.length).toBeGreaterThanOrEqual(1)
  })

  it('should render the brand link home', () => {
    render(<MainNav />)

    const brand = screen.getByRole('link', { name: /^jason rundell$/i })
    expect(brand).toBeInTheDocument()
    expect(brand).toHaveAttribute('href', '/')
  })

  it('should render About link in desktop navigation', () => {
    render(<MainNav />)

    const aboutLink = screen.getByRole('link', { name: /^about$/i })
    expect(aboutLink).toBeInTheDocument()
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('should render How I lead link in desktop navigation', () => {
    render(<MainNav />)

    const link = screen.getByRole('link', { name: /^how i lead$/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/how-i-lead')
  })

  it('should render Selected work link in desktop navigation', () => {
    render(<MainNav />)

    const projectsLink = screen.getByRole('link', { name: /^selected work$/i })
    expect(projectsLink).toBeInTheDocument()
    expect(projectsLink).toHaveAttribute('href', '/projects')
  })

  it('should render Writing link in desktop navigation', () => {
    render(<MainNav />)

    const blogLink = screen.getByRole('link', { name: /^writing$/i })
    expect(blogLink).toBeInTheDocument()
    expect(blogLink).toHaveAttribute('href', '/posts')
  })

  it('should render the Book a conversation CTA', () => {
    render(<MainNav />)

    const contactLink = screen.getByRole('link', {
      name: /^book a conversation$/i,
    })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('should render MainNavClient component', () => {
    // Act
    render(<MainNav />)

    // Assert
    expect(screen.getByTestId('main-nav-client')).toBeInTheDocument()
  })
})
