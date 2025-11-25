import { GET } from './route'
import { LastSong } from '@/typeDefinitions/app'

// Mock contentful
jest.mock('@/lib/contentful', () => ({
  getLastSong: jest.fn(),
}))

const { getLastSong: mockGetLastSong } = jest.requireMock<{
  getLastSong: jest.Mock
}>('@/lib/contentful')

describe('GET /api/last-song', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Response', () => {
    it('should return last song data', async () => {
      // Arrange
      const mockSong: LastSong = {
        title: 'Test Song',
        artist: 'Test Artist',
        url: 'https://music.youtube.com/watch?v=test123',
        youtubeId: 'test123',
        fields: {},
        contentTypeId: 'lastSong',
      } as LastSong
      mockGetLastSong.mockResolvedValue(mockSong)

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(mockSong)
      expect(mockGetLastSong).toHaveBeenCalledTimes(1)
    })

    it('should return null when no song is found', async () => {
      // Arrange
      mockGetLastSong.mockResolvedValue(null)

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toBeNull()
      expect(mockGetLastSong).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('should return 500 error when getLastSong throws', async () => {
      // Arrange
      mockGetLastSong.mockRejectedValue(new Error('Contentful error'))

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch last song' })
      expect(mockGetLastSong).toHaveBeenCalledTimes(1)
    })

    it('should handle unknown errors', async () => {
      // Arrange
      mockGetLastSong.mockRejectedValue('String error')

      // Act
      const response = await GET()
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch last song' })
    })
  })
})
