import { render, screen } from '@testing-library/react'
import HubDoors, { HubDoor } from './HubDoors'

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  }
})

const fakeDoors: ReadonlyArray<HubDoor> = [
  { href: '/about', label: 'About', description: 'about d' },
  { href: '/projects', label: 'Projects', description: 'projects d' },
  { href: '/posts', label: 'Blog', description: 'posts d' },
]

describe('HubDoors', () => {
  it('renders one nav landmark labelled "Site sections" by default', () => {
    render(<HubDoors doors={fakeDoors} />)

    expect(
      screen.getByRole('navigation', { name: /site sections/i })
    ).toBeInTheDocument()
  })

  it('honors a custom aria-label', () => {
    render(<HubDoors doors={fakeDoors} ariaLabel="Choose a destination" />)

    expect(
      screen.getByRole('navigation', { name: /choose a destination/i })
    ).toBeInTheDocument()
  })

  it('renders one link per door with the right href and label', () => {
    render(<HubDoors doors={fakeDoors} />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'href',
      '/projects'
    )
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute(
      'href',
      '/posts'
    )
  })

  it('renders the description text inside each door', () => {
    render(<HubDoors doors={fakeDoors} />)

    expect(screen.getByText(/about d/i)).toBeInTheDocument()
    expect(screen.getByText(/projects d/i)).toBeInTheDocument()
    expect(screen.getByText(/posts d/i)).toBeInTheDocument()
  })

  it('renders an empty nav when given no doors', () => {
    render(<HubDoors doors={[]} />)

    const nav = screen.getByRole('navigation', { name: /site sections/i })
    expect(nav).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
