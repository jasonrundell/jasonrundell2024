import { render, screen } from '@testing-library/react'
import InfiniteSourcePromo, {
  INFINITE_SOURCE_URL,
  INFINITE_SOURCE_SERVICES,
  INFINITE_SOURCE_VENTURES,
} from './InfiniteSourcePromo'

describe('InfiniteSourcePromo', () => {
  it('renders the section heading', () => {
    render(<InfiniteSourcePromo />)

    expect(
      screen.getByRole('heading', { name: /infinite source agency inc\./i })
    ).toBeInTheDocument()
  })

  it('states that Jason founded and runs the agency', () => {
    render(<InfiniteSourcePromo />)

    expect(screen.getByText(/i founded and run/i)).toBeInTheDocument()
  })

  it('lists every service', () => {
    render(<InfiniteSourcePromo />)

    for (const service of INFINITE_SOURCE_SERVICES) {
      expect(screen.getByText(service.title)).toBeInTheDocument()
    }
  })

  it('lists every venture with its status', () => {
    render(<InfiniteSourcePromo />)

    for (const venture of INFINITE_SOURCE_VENTURES) {
      expect(screen.getByText(venture.name)).toBeInTheDocument()
      expect(screen.getByText(`(${venture.status})`)).toBeInTheDocument()
    }
  })

  it('links ventures that have a destination out to that destination', () => {
    render(<InfiniteSourcePromo />)

    const linkedVentures = INFINITE_SOURCE_VENTURES.filter((v) => v.href)
    for (const venture of linkedVentures) {
      const link = screen.getByRole('link', { name: venture.name })
      expect(link).toHaveAttribute('href', venture.href)
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders a CTA linking to the Infinite Source site', () => {
    render(<InfiniteSourcePromo />)

    const cta = screen.getByRole('link', { name: /visit infinitesource\.agency/i })
    expect(cta).toHaveAttribute('href', INFINITE_SOURCE_URL)
  })
})
