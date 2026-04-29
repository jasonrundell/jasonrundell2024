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

  it('renders the terminal command failure for the current path', () => {
    render(
      <TerminalErrorPage
        statusCode="404"
        title="Page Not Found"
        comment="not-found.tsx"
        message="No route matched this command."
      />
    )

    expect(
      screen.getByRole('heading', { level: 1, name: /404: page not found/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/command not found:/i)).toHaveTextContent(
      '$ command not found: /missing-route'
    )
    expect(screen.getByRole('link', { name: /cd \/home/i })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('calls reset when the retry command is available', async () => {
    const reset = jest.fn()
    const user = userEvent.setup()

    render(
      <TerminalErrorPage
        statusCode="500"
        title="Runtime Error"
        comment="global-error.tsx"
        message="The route crashed before it could finish rendering."
        reset={reset}
      />
    )

    await user.click(screen.getByRole('button', { name: /retry command/i }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
