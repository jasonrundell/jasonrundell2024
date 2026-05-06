import { render, screen } from '@testing-library/react'
import ContentImage from './ContentImage'

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    ...rest
  }: {
    src: string
    alt?: string
    fill?: boolean
    [key: string]: unknown
  }) {
    const htmlProps = { ...rest } as Record<string, unknown>
    delete htmlProps.sizes
    delete htmlProps.style
    delete htmlProps.quality
    delete htmlProps.className
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? ''}
        data-fill={fill}
        data-testid="content-image"
        {...(htmlProps as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    )
  }
})

describe('ContentImage', () => {
  it('renders an image with the given src and alt', () => {
    render(<ContentImage src="/content/posts/test/featured.webp" alt="Test image" />)
    const img = screen.getByTestId('content-image')
    expect(img).toHaveAttribute('src', '/content/posts/test/featured.webp')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('defaults alt to empty string when not provided', () => {
    render(<ContentImage src="/content/posts/test/featured.webp" />)
    const img = screen.getByTestId('content-image')
    expect(img).toHaveAttribute('alt', '')
  })

  it('passes fill prop through to next/image', () => {
    render(<ContentImage src="/content/test.webp" fill={true} alt="fill image" />)
    const img = screen.getByTestId('content-image')
    expect(img).toHaveAttribute('data-fill', 'true')
  })
})
