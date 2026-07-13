import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectGallery from './ProjectGallery'
import { ContentImage } from '@/typeDefinitions/app'

jest.mock('next/image', () => {
  return function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="gallery-image" />
  }
})

jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left-icon">ChevronLeft</span>,
  ChevronRight: () => (
    <span data-testid="chevron-right-icon">ChevronRight</span>
  ),
  X: () => <span data-testid="close-icon">X</span>,
}))

jest.mock('./ContentImage', () => {
  return function MockContentImage({
    src,
    alt,
    fill,
    sizes,
    style,
    quality,
  }: {
    src: string
    alt?: string
    fill?: boolean
    sizes?: string
    style?: React.CSSProperties
    quality?: number
  }) {
    return (
      <img
        src={src}
        alt={alt ?? ''}
        data-fill={fill}
        data-sizes={sizes}
        data-style={JSON.stringify(style)}
        data-quality={quality}
        data-testid="gallery-image"
      />
    )
  }
})

jest.mock('@/styles/motion', () => ({
  RevealStaggerGroup: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  RevealStaggerItem: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

jest.mock('@/styles/common', () => ({
  StyledModal: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <div data-testid="modal" onClick={onClick} {...props}>
      {children}
    </div>
  ),
  StyledModalContent: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: (e: React.MouseEvent) => void
  }) => (
    <div data-testid="modal-content" onClick={onClick}>
      {children}
    </div>
  ),
  StyledCloseButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button data-testid="close-button" onClick={onClick}>
      {children}
    </button>
  ),
}))

const makeImage = (overrides?: Partial<ContentImage>): ContentImage => ({
  src: '/content/projects/test/gallery/01.webp',
  alt: 'Gallery image',
  description: 'Image description',
  ...overrides,
})

describe('ProjectGallery', () => {
  it('returns null when images is empty', () => {
    const { container } = render(<ProjectGallery images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when images is null/undefined', () => {
    const { container } = render(
      <ProjectGallery images={null as unknown as ContentImage[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders a grid of valid images', () => {
    const images = [
      makeImage({ src: '/content/p/gallery/01.webp', alt: 'img 1' }),
      makeImage({ src: '/content/p/gallery/02.webp', alt: 'img 2' }),
    ]
    render(<ProjectGallery images={images} />)

    const galleryImages = screen.getAllByTestId('gallery-image')
    expect(galleryImages).toHaveLength(2)
    expect(galleryImages[0]).toHaveAttribute(
      'src',
      '/content/p/gallery/01.webp'
    )
    expect(galleryImages[1]).toHaveAttribute(
      'src',
      '/content/p/gallery/02.webp'
    )
  })

  it('filters out images without a src', () => {
    const images = [
      makeImage({ src: '/content/p/gallery/01.webp' }),
      makeImage({ src: '' }),
      makeImage({ src: '/content/p/gallery/03.webp' }),
    ]
    render(<ProjectGallery images={images} />)

    expect(screen.getAllByTestId('gallery-image')).toHaveLength(2)
  })

  it('opens the modal when an image is clicked', async () => {
    const user = userEvent.setup()
    const images = [makeImage({ alt: 'Photo A' })]
    render(<ProjectGallery images={images} />)

    await user.click(
      screen.getByRole('button', { name: /view photo a in full screen/i })
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    const images = [makeImage()]
    render(<ProjectGallery images={images} />)

    await user.click(
      screen.getByRole('button', { name: /view gallery image in full screen/i })
    )
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    await user.click(screen.getByTestId('close-button'))
    await waitFor(() =>
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    )
  })

  it('shows image info when title and description are present', async () => {
    const user = userEvent.setup()
    const images = [makeImage({ alt: 'My Photo', description: 'Sunset scene' })]
    render(<ProjectGallery images={images} />)

    await user.click(
      screen.getByRole('button', { name: /view my photo in full screen/i })
    )

    expect(screen.getByText('My Photo')).toBeInTheDocument()
    expect(screen.getByText('Sunset scene')).toBeInTheDocument()
  })

  it('shows prev/next buttons for multiple images', async () => {
    const user = userEvent.setup()
    const images = [
      makeImage({ src: '/a.webp', alt: 'First' }),
      makeImage({ src: '/b.webp', alt: 'Second' }),
      makeImage({ src: '/c.webp', alt: 'Third' }),
    ]
    render(<ProjectGallery images={images} />)

    await user.click(
      screen.getByRole('button', { name: /view second in full screen/i })
    )

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    expect(screen.getByLabelText('Next image')).toBeInTheDocument()
  })

  it('handles keyboard navigation (Escape closes, ArrowLeft/Right navigate)', async () => {
    const user = userEvent.setup()
    const images = [
      makeImage({ src: '/a.webp', alt: 'First' }),
      makeImage({ src: '/b.webp', alt: 'Second' }),
      makeImage({ src: '/c.webp', alt: 'Third' }),
    ]
    render(<ProjectGallery images={images} />)

    // Open modal on second image (has both prev and next)
    await user.click(
      screen.getByRole('button', { name: /view second in full screen/i })
    )
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    // ArrowLeft navigates to previous
    await user.keyboard('{ArrowLeft}')
    // ArrowRight navigates back
    await user.keyboard('{ArrowRight}')
    // ArrowRight again (at last - no-op branch)
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')
    // ArrowLeft (at first - no-op branch)
    await user.keyboard('{ArrowLeft}')
    await user.keyboard('{ArrowLeft}')
    // Escape closes
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    )
  })

  it('navigates prev/next with button clicks', async () => {
    const user = userEvent.setup()
    const images = [
      makeImage({ src: '/a.webp', alt: 'First' }),
      makeImage({ src: '/b.webp', alt: 'Second' }),
    ]
    render(<ProjectGallery images={images} />)

    await user.click(
      screen.getByRole('button', { name: /view second in full screen/i })
    )

    const prevBtn = screen.getByLabelText('Previous image')
    await user.click(prevBtn)
    // After navigating to first, prev button should be gone
    await waitFor(() =>
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
    )
  })

  it('opens gallery item via Enter keydown', async () => {
    const user = userEvent.setup()
    const images = [makeImage({ alt: 'Keyboard test' })]
    render(<ProjectGallery images={images} />)

    const galleryButton = screen.getByRole('button', {
      name: /view keyboard test in full screen/i,
    })
    await user.type(galleryButton, '{Enter}')
    await waitFor(() => expect(screen.getByTestId('modal')).toBeInTheDocument())
  })

  it('passes correct props to ContentImage', async () => {
    const user = userEvent.setup()
    const images = [
      makeImage({ src: '/content/p/gallery/01.webp', alt: 'Prop test' }),
    ]
    render(<ProjectGallery images={images} />)

    const galleryImg = screen.getByTestId('gallery-image')
    expect(galleryImg).toHaveAttribute('src', '/content/p/gallery/01.webp')
    expect(galleryImg).toHaveAttribute('alt', 'Image description')
    expect(galleryImg).toHaveAttribute('data-fill', 'true')

    await user.click(
      screen.getByRole('button', { name: /view prop test in full screen/i })
    )
    const modalImages = screen.getAllByTestId('gallery-image')
    expect(modalImages[1]).toHaveAttribute('data-quality', '90')
  })
})
