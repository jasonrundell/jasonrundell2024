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

  it('moves focus to #main-content on mount when present', () => {
    const main = document.createElement('div')
    main.id = 'main-content'
    main.tabIndex = -1
    document.body.appendChild(main)
    const focusSpy = jest.spyOn(main, 'focus')

    render(
      <PageTransition>
        <p>Focused route</p>
      </PageTransition>
    )

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })

    focusSpy.mockRestore()
    document.body.removeChild(main)
  })
})
