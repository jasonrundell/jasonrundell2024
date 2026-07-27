import { render, screen } from '@testing-library/react'
import ProjectPreviewImage from './ProjectPreviewImage'

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

jest.mock('./ContentImage', () => {
  return function MockContentImage({
    src,
    alt,
  }: {
    src: string
    alt?: string
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} data-testid="content-image" />
  }
})

describe('ProjectPreviewImage', () => {
  describe('Local URL provided', () => {
    it('renders the content image at the given URL', () => {
      render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="/content/projects/matter-ops/featured.webp"
          altText="Matter Ops dashboard"
        />
      )

      const img = screen.getByTestId('content-image')
      expect(img).toHaveAttribute(
        'src',
        '/content/projects/matter-ops/featured.webp'
      )
      expect(img).toHaveAttribute('alt', 'Matter Ops dashboard')
    })

    it('does NOT render the line-art placeholder when a URL is provided', () => {
      const { container } = render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="/content/projects/matter-ops/featured.webp"
        />
      )

      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  describe('URL missing - placeholder fallback', () => {
    it('renders the line-art placeholder when no URL is provided', () => {
      const { container } = render(
        <ProjectPreviewImage title="ARC Line" slug="arcline" />
      )

      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(screen.queryByTestId('content-image')).not.toBeInTheDocument()
    })

    it('hides the placeholder from assistive tech (purely decorative)', () => {
      const { container } = render(
        <ProjectPreviewImage title="ARC Line" slug="arcline" />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('role', 'presentation')
    })
  })

  describe('Link wrapping', () => {
    it('wraps in a project link when a slug is provided', () => {
      render(
        <ProjectPreviewImage
          title="Matter Ops"
          slug="matter-ops"
          url="/content/projects/matter-ops/featured.webp"
        />
      )

      const link = screen.getByRole('link', { name: 'Matter Ops' })
      expect(link).toHaveAttribute('href', '/projects/matter-ops')
    })

    it('renders without a link wrapper when no slug is provided', () => {
      const { container } = render(<ProjectPreviewImage title="ARC Line" />)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })
})
