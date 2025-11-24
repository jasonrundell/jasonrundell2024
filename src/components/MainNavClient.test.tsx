import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MainNavClient from './MainNavClient'

// Mock dependencies
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode
    href: string
    onClick?: () => void
  }) {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
})

jest.mock('@/components/auth/ui/button', () => ({
  Button: ({
    children,
    asChild,
    variant,
    size,
    type,
    onClick,
  }: {
    children: React.ReactNode
    asChild?: boolean
    variant?: string
    size?: string
    type?: string
    onClick?: () => void
  }) => {
    if (asChild) {
      return <div data-testid="button-as-child">{children}</div>
    }
    return (
      <button
        data-testid="button"
        data-variant={variant}
        data-size={size}
        type={type}
        onClick={onClick}
      >
        {children}
      </button>
    )
  },
}))

jest.mock('@/app/actions', () => ({
  signOutAction: jest.fn(),
}))

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}))

const { createClient } = jest.requireMock<{
  createClient: jest.Mock
}>('@/utils/supabase/client')

describe('MainNavClient Component', () => {
  let mockSupabaseClient: {
    auth: {
      getSession: jest.Mock
      onAuthStateChange: jest.Mock
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabaseClient = {
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    }
    createClient.mockReturnValue(mockSupabaseClient)
  })

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      // Arrange
      mockSupabaseClient.auth.getSession.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          })
      )
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })

      // Act
      render(<MainNavClient />)

      // Assert
      expect(screen.getByText(/loading navigation/i)).toBeInTheDocument()
    })
  })

  describe('Unauthenticated State', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
    })

    it('should render login and sign up buttons when not authenticated', async () => {
      // Act
      render(<MainNavClient />)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
        expect(
          screen.getByRole('link', { name: /sign up/i })
        ).toBeInTheDocument()
      })
    })

    it('should render mobile menu button', async () => {
      // Act
      render(<MainNavClient />)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /toggle mobile menu/i })
        ).toBeInTheDocument()
      })
    })

    it('should toggle mobile menu when button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<MainNavClient />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /toggle mobile menu/i })
        ).toBeInTheDocument()
      })
      const menuButton = screen.getByRole('button', {
        name: /toggle mobile menu/i,
      })
      await user.click(menuButton)

      // Assert
      const mobileMenu = document.getElementById('mobile-menu')
      expect(mobileMenu).toHaveClass('open')
    })

    it('should close mobile menu when link is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<MainNavClient />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /toggle mobile menu/i })
        ).toBeInTheDocument()
      })
      const menuButton = screen.getByRole('button', {
        name: /toggle mobile menu/i,
      })
      await user.click(menuButton)

      // Wait for menu to open
      await waitFor(() => {
        const mobileMenu = document.getElementById('mobile-menu')
        expect(mobileMenu).toHaveClass('open')
      })

      // Click a link to close menu
      const blogLink = screen.getByRole('link', { name: /blog/i })
      await user.click(blogLink)

      // Assert
      await waitFor(() => {
        const mobileMenu = document.getElementById('mobile-menu')
        expect(mobileMenu).not.toHaveClass('open')
      })
    })
  })

  describe('Authenticated State', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id', email: 'test@example.com' },
          },
        },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
    })

    it('should render profile and logout buttons when authenticated', async () => {
      // Act
      render(<MainNavClient />)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /profile/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /log out/i })
        ).toBeInTheDocument()
      })
    })

    it('should render profile link in mobile menu when authenticated', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<MainNavClient />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /toggle mobile menu/i })
        ).toBeInTheDocument()
      })
      const menuButton = screen.getByRole('button', {
        name: /toggle mobile menu/i,
      })
      await user.click(menuButton)

      // Assert
      await waitFor(() => {
        const profileLinks = screen.getAllByRole('link', { name: /profile/i })
        expect(profileLinks.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Scroll Handling', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
    })

    it('should add scrolled class when window is scrolled', async () => {
      // Arrange
      // Create the menu element that MainNavClient expects to exist
      const menuElement = document.createElement('div')
      menuElement.id = 'menu'
      document.body.appendChild(menuElement)

      render(<MainNavClient />)
      await waitFor(() => {
        expect(document.getElementById('menu')).toBeInTheDocument()
      })

      // Act
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })
      window.dispatchEvent(new Event('scroll'))

      // Assert
      await waitFor(() => {
        const menu = document.getElementById('menu')
        expect(menu).toBeInTheDocument()
        expect(menu).toHaveClass('scrolled')
      })

      // Cleanup
      document.body.removeChild(menuElement)
    })
  })

  describe('Resize Handling', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
    })

    it('should close mobile menu when window is resized to large screen', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<MainNavClient />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /toggle mobile menu/i })
        ).toBeInTheDocument()
      })
      const menuButton = screen.getByRole('button', {
        name: /toggle mobile menu/i,
      })
      await user.click(menuButton)

      // Wait for menu to open
      await waitFor(() => {
        const mobileMenu = document.getElementById('mobile-menu')
        expect(mobileMenu).toHaveClass('open')
      })

      // Simulate resize to large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      window.dispatchEvent(new Event('resize'))

      // Assert
      await waitFor(() => {
        const mobileMenu = document.getElementById('mobile-menu')
        expect(mobileMenu).not.toHaveClass('open')
      })
    })
  })
})
