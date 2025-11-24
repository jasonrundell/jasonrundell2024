import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SupabaseStatusBanner from './SupabaseStatusBanner'

// Mock fetch
global.fetch = jest.fn()

describe('SupabaseStatusBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Loading State', () => {
    it('should not render when loading', () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          })
      )

      // Act
      const { container } = render(<SupabaseStatusBanner />)

      // Assert
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Paused State', () => {
    it('should display paused message when Supabase is paused', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: true,
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /database is currently paused. please resume your supabase project/i
          )
        ).toBeInTheDocument()
      })
    })

    it('should show Resume Project button when paused', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: true,
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)

      // Assert
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /resume project/i })
        expect(button).toBeInTheDocument()
      })
    })

    it('should open Supabase dashboard when Resume Project is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: true,
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /resume project/i })
        ).toBeInTheDocument()
      })
      const button = screen.getByRole('button', { name: /resume project/i })
      await user.click(button)

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://app.supabase.com',
        '_blank'
      )
      windowOpenSpy.mockRestore()
    })
  })

  describe('Available State', () => {
    it('should display available message when showWhenAvailable is true', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: true,
          isPaused: false,
        }),
      })

      // Act
      render(<SupabaseStatusBanner showWhenAvailable={true} />)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/database is available and running normally/i)
        ).toBeInTheDocument()
      })
    })

    it('should not display banner when showWhenAvailable is false and available', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: true,
          isPaused: false,
        }),
      })

      // Act
      const { container } = render(
        <SupabaseStatusBanner showWhenAvailable={false} />
      )

      // Assert
      await waitFor(() => {
        const banner = container.querySelector('[class*="visible"]')
        expect(banner).not.toBeInTheDocument()
      })
    })

    it('should auto-hide success message after duration', async () => {
      // Arrange
      jest.useFakeTimers()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: true,
          isPaused: false,
        }),
      })

      // Act
      const { container } = render(
        <SupabaseStatusBanner
          showWhenAvailable={true}
          autoHide={true}
          hideDuration={1000}
        />
      )

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/database is available and running normally/i)
        ).toBeInTheDocument()
      })

      // Fast-forward time
      jest.advanceTimersByTime(1000)

      await waitFor(() => {
        const banner = container.querySelector('[class*="hidden"]')
        expect(banner).toBeInTheDocument()
      })

      jest.useRealTimers()
    })
  })

  describe('Error State', () => {
    it('should display error message when Supabase is unavailable', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: false,
          error: 'Connection failed',
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(
            /database is currently paused. please resume your supabase project/i
          )
        ).toBeInTheDocument()
      })
    })

    it('should show Retry Connection button when unavailable', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: false,
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)

      // Assert
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /retry connection/i })
        expect(button).toBeInTheDocument()
      })
    })

    it('should retry status check when Retry button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: false,
        }),
      })

      // Act
      render(<SupabaseStatusBanner />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /retry connection/i })
        ).toBeInTheDocument()
      })
      const button = screen.getByRole('button', { name: /retry connection/i })
      await user.click(button)

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2)
      })
    })

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      // Act
      render(<SupabaseStatusBanner />)

      // Assert
      await waitFor(() => {
        // The component shows a generic paused message on error
        expect(
          screen.getByText(
            /database is currently paused. please resume your supabase project/i
          )
        ).toBeInTheDocument()
      })
    })
  })

  describe('Close Button', () => {
    it('should hide banner when close button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: false,
          isPaused: true,
        }),
      })

      // Act
      const { container } = render(<SupabaseStatusBanner />)
      await waitFor(() => {
        expect(screen.getByLabelText(/close banner/i)).toBeInTheDocument()
      })
      const closeButton = screen.getByLabelText(/close banner/i)
      await user.click(closeButton)

      // Assert
      await waitFor(() => {
        const banner = container.querySelector('[class*="hidden"]')
        expect(banner).toBeInTheDocument()
      })
    })
  })

  describe('Caching', () => {
    it('should cache status and not fetch again within cache duration', async () => {
      // Arrange
      jest.useFakeTimers()
      ;(global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          isAvailable: true,
          isPaused: false,
        }),
      })

      // Act
      render(<SupabaseStatusBanner showWhenAvailable={true} />)

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      // Fast-forward time but not past cache duration
      jest.advanceTimersByTime(30000)

      // Should still only have been called once
      expect(global.fetch).toHaveBeenCalledTimes(1)

      jest.useRealTimers()
    })
  })
})
