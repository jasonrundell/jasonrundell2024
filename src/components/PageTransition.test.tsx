import { render, screen } from '@testing-library/react'

import PageTransition from './PageTransition'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/some-route'),
}))

describe('PageTransition', () => {
  it('wraps children in a keyed transition container', () => {
    render(
      <PageTransition>
        <p>Page body</p>
      </PageTransition>
    )

    const body = screen.getByText('Page body')
    expect(body).toBeInTheDocument()
    expect(body.parentElement).toHaveClass('page-transition')
  })
})
