import { render, screen } from '@testing-library/react'
import ContentfulImage from './ContentfulImage'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    loader,
    fill,
    className,
    sizes,
    style,
    quality,
  }: {
    src: string
    alt: string
    width?: number
    height?: number
    loader?: (props: { src: string; width: number; quality?: number }) => string
    fill?: boolean
    className?: string
    sizes?: string
    style?: React.CSSProperties
    quality?: number
  }) {
    const loaderResult = loader
      ? loader({ src, width: width || 800, quality })
      : src
    return (
      <img
        src={loaderResult}
        alt={alt}
        width={width}
        height={height}
        data-fill={fill}
        data-class={className}
        data-sizes={sizes}
        data-testid="contentful-image"
      />
    )
  }
})

describe('ContentfulImage Component', () => {
  it('should render image with correct src', () => {
    // Act
    render(
      <ContentfulImage src="https://images.ctfassets.net/test/image.jpg" />
    )

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'))
  })

  it('should render image with correct alt text', () => {
    // Act
    render(<ContentfulImage src="test.jpg" alt="Test Image" />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute('alt', 'Test Image')
  })

  it('should use empty alt when alt is not provided', () => {
    // Act
    render(<ContentfulImage src="test.jpg" />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute('alt', '')
  })

  it('should render image with correct dimensions', () => {
    // Act
    render(<ContentfulImage src="test.jpg" width={800} height={600} />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute('width', '800')
    expect(image).toHaveAttribute('height', '600')
  })

  it('should use contentful loader with correct parameters', () => {
    // Act
    render(<ContentfulImage src="test.jpg" width={800} quality={90} />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    const src = image.getAttribute('src')
    expect(src).toContain('w=800')
    expect(src).toContain('q=90')
  })

  it('should use default quality of 75 when not specified', () => {
    // Act
    render(<ContentfulImage src="test.jpg" width={800} />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    const src = image.getAttribute('src')
    expect(src).toContain('q=75')
  })

  it('should support fill prop', () => {
    // Act
    render(<ContentfulImage src="test.jpg" fill />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute('data-fill', 'true')
  })

  it('should support className prop', () => {
    // Act
    render(<ContentfulImage src="test.jpg" className="custom-class" />)

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute('data-class', 'custom-class')
  })

  it('should support sizes prop', () => {
    // Act
    render(
      <ContentfulImage src="test.jpg" sizes="(max-width: 768px) 100vw, 50vw" />
    )

    // Assert
    const image = screen.getByTestId('contentful-image')
    expect(image).toHaveAttribute(
      'data-sizes',
      '(max-width: 768px) 100vw, 50vw'
    )
  })
})
