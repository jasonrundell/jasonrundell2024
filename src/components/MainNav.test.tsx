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

jest.mock('./HeadingAnimation', () => {
  return function MockHeadingAnimation() {
    return <div data-testid="heading-animation">Jason Rundell</div>
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

  it('should render heading animation in desktop nav', () => {
    // Act
    render(<MainNav />)

    // Assert
    const animations = screen.getAllByTestId('heading-animation')
    expect(animations.length).toBeGreaterThan(0)
  })

  it('should render About link in desktop navigation', () => {
    render(<MainNav />)

    const aboutLink = screen.getByRole('link', { name: /^about$/i })
    expect(aboutLink).toBeInTheDocument()
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('should render Projects link in desktop navigation', () => {
    render(<MainNav />)

    const projectsLink = screen.getByRole('link', { name: /^projects$/i })
    expect(projectsLink).toBeInTheDocument()
    expect(projectsLink).toHaveAttribute('href', '/projects')
  })

  it('should render Blog link in desktop navigation', () => {
    render(<MainNav />)

    const blogLink = screen.getByRole('link', { name: /^blog$/i })
    expect(blogLink).toBeInTheDocument()
    expect(blogLink).toHaveAttribute('href', '/posts')
  })

  it('should render Contact link in desktop navigation', () => {
    render(<MainNav />)

    const contactLink = screen.getByRole('link', { name: /^contact$/i })
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
