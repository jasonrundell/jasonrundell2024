import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TerminalErrorPage from './TerminalErrorPage'

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
})

const { usePathname } = jest.requireMock<{
  usePathname: jest.Mock
}>('next/navigation')

describe('TerminalErrorPage', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/missing-route')
  })

  it('falls back to "/" when usePathname returns null', () => {
    usePathname.mockReturnValue(null)
    render(
      <TerminalErrorPage
        statusCode="404"
        title="Page not found"
        comment="Not found"
        message="No route matched."
      />
    )
    expect(
      screen.getByText(
        (_, el) => el?.textContent === 'No page at /'
      )
    ).toBeInTheDocument()
  })

  it('renders the error message for the current path', () => {
    render(
      <TerminalErrorPage
        statusCode="404"
        title="Page not found"
        comment="Not found"
        message="No route matched this command."
      />
    )

    expect(
      screen.getByRole('heading', { level: 1, name: /404.*page not found/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, el) => el?.textContent === 'No page at /missing-route'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to home/i })
    ).toHaveAttribute('href', '/')
  })

  it('calls reset when the retry action is available', async () => {
    const reset = jest.fn()
    const user = userEvent.setup()

    render(
      <TerminalErrorPage
        statusCode="500"
        title="Something went wrong"
        comment="Error"
        message="The route crashed before it could finish rendering."
        reset={reset}
      />
    )

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
