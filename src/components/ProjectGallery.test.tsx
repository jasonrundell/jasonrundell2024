import { render, screen } from '@testing-library/react'
import ProjectGallery from './ProjectGallery'
import { GalleryImage } from '@/typeDefinitions/app'
import { ContentfulSys } from '@/typeDefinitions/contentful'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    sizes,
    style,
  }: {
    src: string
    alt: string
    fill?: boolean
    sizes?: string
    style?: React.CSSProperties
  }) {
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        data-sizes={sizes}
        data-style={JSON.stringify(style)}
        data-testid="gallery-image"
      />
    )
  }
})

// Mock ContentfulImage component
jest.mock('./ContentfulImage', () => {
  return function MockContentfulImage({
    src,
    alt,
    fill,
    sizes,
    style,
  }: {
    src: string
    alt: string
    fill?: boolean
    sizes?: string
    style?: React.CSSProperties
  }) {
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        data-sizes={sizes}
        data-style={JSON.stringify(style)}
        data-testid="contentful-image"
      />
    )
  }
})

// Mock Grid component from dropship
jest.mock('@jasonrundell/dropship', () => ({
  Grid: ({
    children,
    gridTemplateColumns,
    mediumTemplateColumns,
    largeTemplateColumns,
    columnGap,
    rowGap,
  }: {
    children: React.ReactNode
    gridTemplateColumns?: string
    mediumTemplateColumns?: string
    largeTemplateColumns?: string
    columnGap?: string
    rowGap?: string
  }) => (
    <div
      data-testid="gallery-grid"
      data-grid-template-columns={gridTemplateColumns}
      data-medium-template-columns={mediumTemplateColumns}
      data-large-template-columns={largeTemplateColumns}
      data-column-gap={columnGap}
      data-row-gap={rowGap}
    >
      {children}
    </div>
  ),
}))

const createMockGalleryImage = (
  overrides?: Partial<GalleryImage>
): GalleryImage => {
  const mockSys: ContentfulSys = {
    sys: {
      type: 'Link',
      linkType: 'Space',
      id: 'space-id',
    },
  }

  return {
    metadata: {
      tags: [],
      concepts: [],
    },
    sys: {
      space: mockSys,
      id: 'image-id-1',
      type: 'Asset',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      environment: mockSys,
      publishedVersion: 1,
      revision: 1,
      locale: 'en-US',
    },
    fields: {
      title: 'Test Image',
      description: 'Test Description',
      file: {
        url: '//images.ctfassets.net/test/image.jpg',
        details: {
          size: 100000,
          image: {
            width: 1920,
            height: 1080,
          },
        },
        fileName: 'image.jpg',
        contentType: 'image/jpeg',
      },
    },
    ...overrides,
  }
}

describe('ProjectGallery Component', () => {
  describe('Rendering', () => {
    it('should render gallery with images', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-1' },
          fields: {
            ...createMockGalleryImage().fields,
            title: 'Image 1',
          },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-2' },
          fields: {
            ...createMockGalleryImage().fields,
            title: 'Image 2',
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image2.jpg',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const grid = screen.getByTestId('gallery-grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveAttribute(
        'data-grid-template-columns',
        '1fr'
      )
      expect(grid).toHaveAttribute(
        'data-medium-template-columns',
        '1fr 1fr'
      )
      expect(grid).toHaveAttribute(
        'data-large-template-columns',
        '1fr 1fr 1fr'
      )
      expect(grid).toHaveAttribute('data-column-gap', '1.5rem')
      expect(grid).toHaveAttribute('data-row-gap', '1.5rem')

      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages).toHaveLength(2)
    })

    it('should not render when images array is empty', () => {
      // Act
      const { container } = render(<ProjectGallery images={[]} />)

      // Assert
      expect(container.firstChild).toBeNull()
    })

    it('should not render when images is null', () => {
      // Act
      const { container } = render(
        <ProjectGallery images={null as unknown as GalleryImage[]} />
      )

      // Assert
      expect(container.firstChild).toBeNull()
    })

    it('should not render when images is undefined', () => {
      // Act
      const { container } = render(
        <ProjectGallery images={undefined as unknown as GalleryImage[]} />
      )

      // Assert
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Image URL Handling', () => {
    it('should prepend https: to URLs starting with //', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image.jpg',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute(
        'src',
        'https://images.ctfassets.net/test/image.jpg'
      )
    })

    it('should not modify URLs that already have protocol', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: 'https://images.ctfassets.net/test/image.jpg',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute(
        'src',
        'https://images.ctfassets.net/test/image.jpg'
      )
    })

    it('should filter out images without URL', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image.jpg',
            },
          },
        }),
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: undefined as unknown as string,
            },
          },
        }),
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: '',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages).toHaveLength(1)
    })
  })

  describe('Alt Text Handling', () => {
    it('should use description as alt text when available', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            description: 'Image description',
            title: 'Image title',
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute('alt', 'Image description')
    })

    it('should fallback to title when description is not available', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            description: undefined,
            title: 'Image title',
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute('alt', 'Image title')
    })

    it('should use fallback alt text when neither description nor title is available', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            description: undefined,
            title: '',
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute('alt', 'Gallery image 1')
    })

    it('should use correct index in fallback alt text for multiple images', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-1' },
          fields: {
            ...createMockGalleryImage().fields,
            description: undefined,
            title: '',
          },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-2' },
          fields: {
            ...createMockGalleryImage().fields,
            description: undefined,
            title: '',
          },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-3' },
          fields: {
            ...createMockGalleryImage().fields,
            description: undefined,
            title: '',
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages[0]).toHaveAttribute('alt', 'Gallery image 1')
      expect(galleryImages[1]).toHaveAttribute('alt', 'Gallery image 2')
      expect(galleryImages[2]).toHaveAttribute('alt', 'Gallery image 3')
    })
  })

  describe('Image Props', () => {
    it('should pass correct props to ContentfulImage', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          fields: {
            ...createMockGalleryImage().fields,
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image.jpg',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const image = screen.getByTestId('contentful-image')
      expect(image).toHaveAttribute('data-fill', 'true')
      expect(image).toHaveAttribute(
        'data-sizes',
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      )
      const style = JSON.parse(image.getAttribute('data-style') || '{}')
      expect(style).toEqual({ objectFit: 'cover' })
    })
  })

  describe('Key Generation', () => {
    it('should use sys.id as key when available', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'unique-id-1' },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'unique-id-2' },
        }),
      ]

      // Act
      const { container } = render(<ProjectGallery images={images} />)

      // Assert
      // Check that images are rendered (keys are used internally by React)
      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages).toHaveLength(2)
      expect(container.querySelectorAll('[data-testid="contentful-image"]')).toHaveLength(2)
    })

    it('should use index as key fallback when sys.id is not available', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: '' },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: '' },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages).toHaveLength(2)
    })
  })

  describe('Multiple Images', () => {
    it('should render all valid images', () => {
      // Arrange
      const images: GalleryImage[] = [
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-1' },
          fields: {
            ...createMockGalleryImage().fields,
            title: 'Image 1',
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image1.jpg',
            },
          },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-2' },
          fields: {
            ...createMockGalleryImage().fields,
            title: 'Image 2',
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image2.jpg',
            },
          },
        }),
        createMockGalleryImage({
          sys: { ...createMockGalleryImage().sys, id: 'image-3' },
          fields: {
            ...createMockGalleryImage().fields,
            title: 'Image 3',
            file: {
              ...createMockGalleryImage().fields.file,
              url: '//images.ctfassets.net/test/image3.jpg',
            },
          },
        }),
      ]

      // Act
      render(<ProjectGallery images={images} />)

      // Assert
      const galleryImages = screen.getAllByTestId('contentful-image')
      expect(galleryImages).toHaveLength(3)
      expect(galleryImages[0]).toHaveAttribute(
        'src',
        'https://images.ctfassets.net/test/image1.jpg'
      )
      expect(galleryImages[1]).toHaveAttribute(
        'src',
        'https://images.ctfassets.net/test/image2.jpg'
      )
      expect(galleryImages[2]).toHaveAttribute(
        'src',
        'https://images.ctfassets.net/test/image3.jpg'
      )
    })
  })
})

