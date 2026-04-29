import { render, screen } from '@testing-library/react'
import ProjectPreviewImage from './ProjectPreviewImage'

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    ...rest
  }: {
    src: unknown
    alt: string
    [key: string]: unknown
  }) {
    const resolved =
      typeof src === 'string'
        ? src
        : ((src as { src?: string } | undefined)?.src ??
          'static-import-placeholder')
    const htmlProps = { ...rest } as Record<string, unknown>
    delete htmlProps.fill
    delete htmlProps.sizes
    delete htmlProps.style
    delete htmlProps.priority
    delete htmlProps.quality
    delete htmlProps.loader
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolved}
        alt={alt}
        data-testid="next-image"
        {...(htmlProps as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    )
  }
})

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    href: string
    'aria-label'?: string
  }) {
    return (
      <a href={href} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
})

jest.mock('./ContentfulImage', () => {
  return function MockContentfulImage({
    src,
    alt,
  }: {
    src: string
    alt?: string
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} data-testid="contentful-image" />
  }
})

describe('ProjectPreviewImage', () => {
  describe('Contentful URL provided', () => {
    it('renders the Contentful image at the given URL', () => {
      render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="//images.ctfassets.net/test/matter.jpg"
          altText="Matter Ops dashboard"
        />
      )

      const img = screen.getByTestId('contentful-image')
      expect(img).toHaveAttribute(
        'src',
        '//images.ctfassets.net/test/matter.jpg'
      )
      expect(img).toHaveAttribute('alt', 'Matter Ops dashboard')
    })

    it('does NOT render the local placeholder when Contentful URL is provided', () => {
      render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="//images.ctfassets.net/test/matter.jpg"
        />
      )

      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })
  })

  describe('Contentful URL missing — placeholder fallback', () => {
    it('renders the local placeholder Image when no URL is provided', () => {
      render(<ProjectPreviewImage title="ARC Line" slug="arcline" />)

      expect(screen.getByTestId('next-image')).toBeInTheDocument()
      expect(screen.queryByTestId('contentful-image')).not.toBeInTheDocument()
    })

    it('renders the placeholder with an empty alt (purely decorative)', () => {
      render(<ProjectPreviewImage title="ARC Line" slug="arcline" />)

      expect(screen.getByTestId('next-image')).toHaveAttribute('alt', '')
    })
  })

  describe('Link wrapping', () => {
    it('wraps in a project link when a slug is provided', () => {
      render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="//images.ctfassets.net/test/matter.jpg"
        />
      )

      const link = screen.getByRole('link', { name: 'Matter Ops' })
      expect(link).toHaveAttribute('href', '/projects/matter-ops')
    })

    it('renders without a link wrapper when no slug is provided', () => {
      render(<ProjectPreviewImage title="ARC Line" />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })
  })
})
