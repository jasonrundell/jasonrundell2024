import { render, screen, waitFor } from '@testing-library/react'
import LastSongWrapper from './LastSongWrapper'
import { LastSong as LastSongType } from '@/typeDefinitions/app'

// Mock fetch
global.fetch = jest.fn()

// Mock LastSong component
jest.mock('./LastSong', () => {
  return function MockLastSong({ song }: { song: LastSongType }) {
    return (
      <div data-testid="last-song">
        {song.title} by {song.artist}
      </div>
    )
  }
})

// Mock LastSongSkeleton component
jest.mock('./LastSongSkeleton', () => {
  return function MockLastSongSkeleton() {
    return <div data-testid="last-song-skeleton">Loading...</div>
  }
})

describe('LastSongWrapper Component', () => {
  const mockSong: LastSongType = {
    title: 'Test Song',
    artist: 'Test Artist',
    url: 'https://music.youtube.com/watch?v=test123',
    youtubeId: 'test123',
    fields: {},
    contentTypeId: 'lastSong',
  } as LastSongType

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('Loading State', () => {
    it('should show skeleton loader while fetching', () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves
          })
      )

      // Act
      render(<LastSongWrapper />)

      // Assert
      expect(screen.getByTestId('last-song-skeleton')).toBeInTheDocument()
    })
  })

  describe('Successful Fetch', () => {
    it('should render LastSong component when song data is fetched', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockSong,
      })

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('last-song')).toBeInTheDocument()
        expect(
          screen.getByText(/test song by test artist/i)
        ).toBeInTheDocument()
      })
      expect(global.fetch).toHaveBeenCalledWith('/api/last-song')
    })

    it('should not render skeleton after data is loaded', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockSong,
      })

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('last-song')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('last-song-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should not render anything when fetch fails', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByTestId('last-song-skeleton')
        ).not.toBeInTheDocument()
      })
      expect(screen.queryByTestId('last-song')).not.toBeInTheDocument()
    })

    it('should not render anything when response is not ok', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      })

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByTestId('last-song-skeleton')
        ).not.toBeInTheDocument()
      })
      expect(screen.queryByTestId('last-song')).not.toBeInTheDocument()
    })

    it('should not render anything when data is null', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null,
      })

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByTestId('last-song-skeleton')
        ).not.toBeInTheDocument()
      })
      expect(screen.queryByTestId('last-song')).not.toBeInTheDocument()
    })

    it('should not render anything when data is missing required fields', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          title: 'Test Song',
          // Missing artist and url
        }),
      })

      // Act
      render(<LastSongWrapper />)

      // Assert
      await waitFor(() => {
        expect(
          screen.queryByTestId('last-song-skeleton')
        ).not.toBeInTheDocument()
      })
      expect(screen.queryByTestId('last-song')).not.toBeInTheDocument()
    })
  })

  describe('Component Cleanup', () => {
    it('should not update state if component is unmounted', async () => {
      // Arrange
      let resolveFetch: (value: Response) => void
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve
      })
      ;(global.fetch as jest.Mock).mockReturnValue(fetchPromise)

      // Act
      const { unmount } = render(<LastSongWrapper />)
      unmount()

      // Resolve fetch after unmount
      resolveFetch!({
        ok: true,
        json: async () => mockSong,
      } as Response)

      // Wait a bit to ensure no state updates
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Assert
      expect(screen.queryByTestId('last-song')).not.toBeInTheDocument()
    })
  })
})
