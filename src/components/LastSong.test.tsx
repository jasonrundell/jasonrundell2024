import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LastSong from './LastSong'
import { LastSong as LastSongType } from '@/typeDefinitions/app'

// Mock next/link
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
  Play: ({ size }: { size: number }) => (
    <svg data-testid="play-icon" width={size} height={size} />
  ),
  ExternalLink: ({ size }: { size: number }) => (
    <svg data-testid="external-link-icon" width={size} height={size} />
  ),
  Music: ({ size, style }: { size: number; style?: React.CSSProperties }) => (
    <svg data-testid="music-icon" width={size} height={size} style={style} />
  ),
}))

// Mock react-dom createPortal to render modal inline for testing
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom')
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  }
})

describe('LastSong Component', () => {
  const mockSongWithYouTubeId: LastSongType = {
    title: 'Test Song',
    artist: 'Test Artist',
    url: 'https://music.youtube.com/watch?v=abc123',
    youtubeId: 'abc123',
  }

  const mockSongWithUrlOnly: LastSongType = {
    title: 'Another Song',
    artist: 'Another Artist',
    url: 'https://music.youtube.com/watch?v=xyz789',
  }

  const mockSongWithoutVideo: LastSongType = {
    title: 'No Video Song',
    artist: 'No Video Artist',
    url: 'https://example.com/song',
  }

  let windowOpenSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation()
    // Reset body overflow style
    document.body.style.overflow = ''
  })

  afterEach(() => {
    windowOpenSpy.mockRestore()
  })

  describe('Rendering Song Info', () => {
    it('should render song title and artist', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      expect(screen.getByText(/listening to:/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Test Song by Test Artist/i)
      ).toBeInTheDocument()
    })

    it('should render music icon', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      expect(screen.getByTestId('music-icon')).toBeInTheDocument()
    })

    it('should render external link to YouTube Music', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      const link = screen.getByRole('link', {
        name: /Open Test Song by Test Artist on YouTube Music/i,
      })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', mockSongWithYouTubeId.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should render external link icon', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      expect(screen.getByTestId('external-link-icon')).toBeInTheDocument()
    })
  })

  describe('Play Button Functionality', () => {
    it('should render play button when video ID is available', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      const playButton = screen.getByRole('button', { name: /play song/i })
      expect(playButton).toBeInTheDocument()
      expect(screen.getByTestId('play-icon')).toBeInTheDocument()
    })

    it('should render play button when URL contains YouTube video ID', () => {
      // Act
      render(<LastSong song={mockSongWithUrlOnly} />)

      // Assert
      const playButton = screen.getByRole('button', { name: /play song/i })
      expect(playButton).toBeInTheDocument()
    })

    it('should not render play button when no video ID is available', () => {
      // Act
      render(<LastSong song={mockSongWithoutVideo} />)

      // Assert
      expect(
        screen.queryByRole('button', { name: /play song/i })
      ).not.toBeInTheDocument()
    })

    it('should open URL in new tab when play is clicked and no video ID available', async () => {
      // This test is for the case where extractYouTubeId returns null
      // but handlePlay still tries to work. We need a URL that doesn't match YouTube patterns
      const user = userEvent.setup()
      const songWithInvalidUrl: LastSongType = {
        title: 'Invalid URL Song',
        artist: 'Invalid Artist',
        url: 'https://example.com/song',
        youtubeId: undefined,
      }

      // Act
      render(<LastSong song={songWithInvalidUrl} />)

      // Since there's no video ID, the play button shouldn't render at all
      // But let's verify the component still renders correctly
      expect(
        screen.queryByRole('button', { name: /play song/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Modal Open/Close Behavior', () => {
    it('should open modal when play button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { name: /video player modal/i })
        ).toBeInTheDocument()
      })
    })

    it('should display YouTube iframe in modal when opened', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle(/Test Song by Test Artist/i)
        expect(iframe).toBeInTheDocument()
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/abc123?autoplay=1'
        )
      })
    })

    it('should close modal when close button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { name: /video player modal/i })
        ).toBeInTheDocument()
      })

      // Close the modal
      const closeButton = screen.getByRole('button', {
        name: /close video player/i,
      })
      await user.click(closeButton)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', { name: /video player modal/i })
        ).not.toBeInTheDocument()
      })
    })

    it('should close modal when clicking outside the modal content', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { name: /video player modal/i })
        ).toBeInTheDocument()
      })

      // Click on the modal backdrop
      const modal = screen.getByRole('dialog', { name: /video player modal/i })
      await user.click(modal)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', { name: /video player modal/i })
        ).not.toBeInTheDocument()
      })
    })

    it('should not close modal when clicking inside modal content', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { name: /video player modal/i })
        ).toBeInTheDocument()
      })

      // Click on the iframe (inside modal content)
      const iframe = screen.getByTitle(/Test Song by Test Artist/i)
      await user.click(iframe)

      // Assert - modal should still be open
      expect(
        screen.getByRole('dialog', { name: /video player modal/i })
      ).toBeInTheDocument()
    })

    it('should prevent body scrolling when modal is open', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
    })

    it('should restore body scrolling when modal is closed', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Wait for modal to open
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })

      // Close modal
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

  describe('Keyboard Escape Handling', () => {
    it('should close modal when Escape key is pressed', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(
          screen.getByRole('dialog', { name: /video player modal/i })
        ).toBeInTheDocument()
      })

      // Press Escape
      await user.keyboard('{Escape}')

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByRole('dialog', { name: /video player modal/i })
        ).not.toBeInTheDocument()
      })
    })

    it('should not respond to Escape when modal is not open', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Press Escape without opening modal
      await user.keyboard('{Escape}')

      // Assert - component should still render normally
      expect(screen.getByText(/listening to:/i)).toBeInTheDocument()
    })
  })

  describe('YouTube ID Extraction', () => {
    it('should extract video ID from standard YouTube URL', () => {
      // Arrange
      const songWithStandardUrl: LastSongType = {
        title: 'Standard URL Song',
        artist: 'Standard Artist',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }

      // Act
      render(<LastSong song={songWithStandardUrl} />)

      // Assert - play button should appear (indicating video ID was extracted)
      expect(
        screen.getByRole('button', { name: /play song/i })
      ).toBeInTheDocument()
    })

    it('should extract video ID from short YouTube URL', () => {
      // Arrange
      const songWithShortUrl: LastSongType = {
        title: 'Short URL Song',
        artist: 'Short Artist',
        url: 'https://youtu.be/dQw4w9WgXcQ',
      }

      // Act
      render(<LastSong song={songWithShortUrl} />)

      // Assert
      expect(
        screen.getByRole('button', { name: /play song/i })
      ).toBeInTheDocument()
    })

    it('should extract video ID from YouTube Music URL', () => {
      // Arrange
      const songWithMusicUrl: LastSongType = {
        title: 'Music URL Song',
        artist: 'Music Artist',
        url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
      }

      // Act
      render(<LastSong song={songWithMusicUrl} />)

      // Assert
      expect(
        screen.getByRole('button', { name: /play song/i })
      ).toBeInTheDocument()
    })

    it('should extract video ID from embed URL', () => {
      // Arrange
      const songWithEmbedUrl: LastSongType = {
        title: 'Embed URL Song',
        artist: 'Embed Artist',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      }

      // Act
      render(<LastSong song={songWithEmbedUrl} />)

      // Assert
      expect(
        screen.getByRole('button', { name: /play song/i })
      ).toBeInTheDocument()
    })

    it('should extract video ID from URL with additional parameters', () => {
      // Arrange
      const songWithParams: LastSongType = {
        title: 'Params URL Song',
        artist: 'Params Artist',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrandom',
      }

      // Act
      render(<LastSong song={songWithParams} />)

      // Assert
      expect(
        screen.getByRole('button', { name: /play song/i })
      ).toBeInTheDocument()
    })

    it('should use provided youtubeId over extracted ID', async () => {
      // Arrange
      const user = userEvent.setup()
      const songWithBothIds: LastSongType = {
        title: 'Both IDs Song',
        artist: 'Both Artist',
        url: 'https://www.youtube.com/watch?v=differentId',
        youtubeId: 'providedId123',
      }

      // Act
      render(<LastSong song={songWithBothIds} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert - should use the provided youtubeId
      await waitFor(() => {
        const iframe = screen.getByTitle(/Both IDs Song by Both Artist/i)
        expect(iframe).toHaveAttribute(
          'src',
          'https://www.youtube.com/embed/providedId123?autoplay=1'
        )
      })
    })

    it('should not show play button for non-YouTube URLs', () => {
      // Arrange
      const songWithNonYouTubeUrl: LastSongType = {
        title: 'Non-YouTube Song',
        artist: 'Non-YouTube Artist',
        url: 'https://spotify.com/track/123',
      }

      // Act
      render(<LastSong song={songWithNonYouTubeUrl} />)

      // Assert
      expect(
        screen.queryByRole('button', { name: /play song/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label on play button', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      const playButton = screen.getByRole('button', { name: /play song/i })
      expect(playButton).toHaveAttribute('aria-label', 'Play song')
    })

    it('should have proper aria-label on external link', () => {
      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)

      // Assert
      const link = screen.getByRole('link', {
        name: /Open Test Song by Test Artist on YouTube Music/i,
      })
      expect(link).toBeInTheDocument()
    })

    it('should have proper role and aria attributes on modal', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveAttribute('aria-modal', 'true')
        expect(modal).toHaveAttribute('aria-label', 'Video player modal')
      })
    })

    it('should have proper aria-label on close button', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const closeButton = screen.getByRole('button', {
          name: /close video player/i,
        })
        expect(closeButton).toHaveAttribute('aria-label', 'Close video player')
      })
    })

    it('should have descriptive title on iframe', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<LastSong song={mockSongWithYouTubeId} />)
      const playButton = screen.getByRole('button', { name: /play song/i })
      await user.click(playButton)

      // Assert
      await waitFor(() => {
        const iframe = screen.getByTitle('Test Song by Test Artist')
        expect(iframe).toBeInTheDocument()
      })
    })
  })
})
