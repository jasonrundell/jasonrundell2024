import { render, screen } from '@testing-library/react'
import Icon from './Icon'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
  }: {
    src: string
    alt: string
    width: number
    height: number
  }) {
    return <img src={src} alt={alt} width={width} height={height} data-testid="icon-image" />
  }
})

describe('Icon Component', () => {
  it('should render LinkedIn icon', () => {
    // Act
    render(<Icon type="LinkedIn" />)

    // Assert
    const image = screen.getByTestId('icon-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'LinkedIn')
  })

  it('should render GitHub icon', () => {
    // Act
    render(<Icon type="GitHub" />)

    // Assert
    const image = screen.getByTestId('icon-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'GitHub')
  })

  it('should render Email icon', () => {
    // Act
    render(<Icon type="Email" />)

    // Assert
    const image = screen.getByTestId('icon-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'Email')
  })

  it('should render Calendar icon', () => {
    // Act
    render(<Icon type="Calendar" />)

    // Assert
    const image = screen.getByTestId('icon-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'Calendar')
  })

  it('should render icon with correct dimensions', () => {
    // Act
    render(<Icon type="LinkedIn" />)

    // Assert
    const image = screen.getByTestId('icon-image')
    expect(image).toHaveAttribute('width', '25')
    expect(image).toHaveAttribute('height', '25')
  })

  it('should return null for invalid icon type', () => {
    // Act
    const { container } = render(
      <Icon type={'Invalid' as 'LinkedIn' | 'GitHub' | 'Email' | 'Calendar'} />
    )

    // Assert
    expect(container.firstChild).toBeNull()
  })
})

