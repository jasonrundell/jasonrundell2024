import { render, screen } from '@testing-library/react'

import LineArt, {
  HeroIllustration,
  LoopIllustration,
  BranchIllustration,
} from './LineArt'

describe('LineArt', () => {
  it('renders a decorative illustration (aria-hidden) by default', () => {
    const { container } = render(<HeroIllustration />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  it('exposes the illustration to assistive tech when a title is provided', () => {
    render(<LoopIllustration title="Operating loop" />)

    const svg = screen.getByRole('img', { name: 'Operating loop' })
    expect(svg).toBeInTheDocument()
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  it('renders a viewBox and path data for each named illustration', () => {
    const { container } = render(<BranchIllustration />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('viewBox')
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('throws for an unknown illustration name', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    expect(() =>
      render(
        // @ts-expect-error deliberately invalid name for the error path
        <LineArt name="does-not-exist" />
      )
    ).toThrow(/unknown illustration/i)
    consoleError.mockRestore()
  })
})
