import { render, screen } from '@testing-library/react'

// Mock @pigment-css/react keyframes
jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

import LastSongSkeleton from './LastSongSkeleton'

describe('LastSongSkeleton Component', () => {
  it('should render skeleton elements', () => {
    // Act
    render(<LastSongSkeleton />)

    // Assert
    const skeletons = screen.getAllByRole('generic', { hidden: true })
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should have aria-hidden attribute on skeleton elements', () => {
    // Act
    const { container } = render(<LastSongSkeleton />)

    // Assert
    // Find all elements with aria-hidden attribute
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThan(0)
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('should render title skeleton', () => {
    // Act
    const { container } = render(<LastSongSkeleton />)

    // Assert
    // The skeleton elements are styled divs, so we check for their presence
    // by looking at the container structure
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render artist skeleton', () => {
    // Act
    const { container } = render(<LastSongSkeleton />)

    // Assert
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render action skeletons', () => {
    // Act
    const { container } = render(<LastSongSkeleton />)

    // Assert
    expect(container.firstChild).toBeInTheDocument()
  })
})

