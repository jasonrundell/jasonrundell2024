import { render, screen, waitFor, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LastSong from './LastSong'
import { LastSong as LastSongType } from '@/typeDefinitions/app'

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    target,
    rel,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    href: string
    target?: string
    rel?: string
    'aria-label'?: string
  }) {
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
})

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Play: () => <span data-testid="play-icon">Play</span>,
  ExternalLink: () => (
    <span data-testid="external-link-icon">ExternalLink</span>
  ),
  Music: () => <span data-testid="music-icon">Music</span>,
}))

// Don't mock react-dom - use actual createPortal

describe('LastSong Component', () => {
  const mockSong: LastSongType = {
    title: 'Test Song',
    artist: 'Test Artist',
    url: 'https://music.youtube.com/watch?v=test123',
    youtubeId: 'test123',
    fields: {},
    contentTypeId: 'lastSong',
  } as LastSongType

  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = ''
  })

  afterEach(() => {
    act(() => {
      cleanup()
    })
    // Ensure body overflow is reset
    document.body.style.overflow = ''
    // Remove any remaining portal content
    const remainingModals = document.body.querySelectorAll('[role="dialog"]')
    remainingModals.forEach((modal) => {
      try {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal)
        }
      } catch {
        // Ignore errors if already removed
      }
    })
  })

  describe('Rendering', () => {
    it('should render song title and artist', () => {
      // Act
      render(<LastSong song={mockSong} />)

      // Assert
      expect(screen.getByText(/listening to:/i)).toBeInTheDocument()
      expect(screen.getByText(/test song by test artist/i)).toBeInTheDocument()
    })

    it('should render play button', () => {
      // Act
      render(<LastSong song={mockSong} />)

      // Assert
      const playButton = screen.getByRole('button', { name: /play song/i })
      expect(playButton).toBeInTheDocument()
    })

    it('should render external link', () => {
      // Act
      render(<LastSong song={mockSong} />)

      // Assert
      const link = screen.getByRole('link', {
        name: /open test song by test artist on youtube music/i,
      })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', mockSong.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should render music icon', () => {
      // Act
      render(<LastSong song={mockSong} />)

      // Assert
      expect(screen.getByTestId('music-icon')).toBeInTheDocument()
    })
  })

  describe('Modal Functionality', () => {
    it('should open modal when play button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()
        expect(modal).toHaveAttribute('aria-modal', 'true')
      })
    })

    it('should render YouTube iframe in modal', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/test song by test artist/i)
        expect(iframe).toBeInTheDocument()
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/test123?autoplay=1'
        )
      })
    })

    it('should close modal when close button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const closeButton = screen.getByRole('button', {
        name: /close video player/i,
      })
      await user.click(closeButton)

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should close modal when clicking outside modal content', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const modal = screen.getByRole('dialog')
      await user.click(modal)

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should not close modal when clicking inside modal content', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      const iframe = screen.getByTitle(/test song by test artist/i)
      await user.click(iframe)

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should close modal when Escape key is pressed', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should lock body scroll when modal is open', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
    })

    it('should unlock body scroll when modal is closed', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSong} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })

      const closeButton = screen.getByRole('button', {
        name: /close video player/i,
      })
      await user.click(closeButton)

      // Assert
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset')
      })
    })
  })

  describe('YouTube ID Extraction', () => {
    it('should use youtubeId prop when provided', async () => {
      // Arrange
      const songWithId: LastSongType = {
        ...mockSong,
        youtubeId: 'custom-id',
      }
      const user = userEvent.setup()

      // Act
      render(<LastSong song={songWithId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/test song by test artist/i)
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/custom-id?autoplay=1'
        )
      })
    })

    it('should extract YouTube ID from music.youtube.com URL', async () => {
      // Arrange
      const songWithoutId: LastSongType = {
        ...mockSong,
        url: 'https://music.youtube.com/watch?v=extracted123',
        youtubeId: undefined,
      }
      const user = userEvent.setup()

      // Act
      render(<LastSong song={songWithoutId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/test song by test artist/i)
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/extracted123?autoplay=1'
        )
      })
    })

    it('should extract YouTube ID from youtube.com URL', async () => {
      // Arrange
      const songWithoutId: LastSongType = {
        ...mockSong,
        url: 'https://www.youtube.com/watch?v=regular123',
        youtubeId: undefined,
      }
      const user = userEvent.setup()

      // Act
      render(<LastSong song={songWithoutId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/test song by test artist/i)
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/regular123?autoplay=1'
        )
      })
    })

    it('should extract YouTube ID from youtu.be URL', async () => {
      // Arrange
      const songWithoutId: LastSongType = {
        ...mockSong,
        url: 'https://youtu.be/short123',
        youtubeId: undefined,
      }
      const user = userEvent.setup()

      // Act
      render(<LastSong song={songWithoutId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/test song by test artist/i)
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/short123?autoplay=1'
        )
      })
    })

    it('should open URL in new window when no YouTube ID can be extracted', async () => {
      // Arrange
      const songWithoutId: LastSongType = {
        ...mockSong,
        url: 'https://example.com/song',
        youtubeId: undefined,
      }
      const user = userEvent.setup()
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation()

      // Act
      render(<LastSong song={songWithoutId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com/song',
        '_blank',
        'noopener noreferrer'
      )

      windowOpenSpy.mockRestore()
    })
  })
})
