import { render, screen } from '@testing-library/react'

import GlobalError from './global-error'

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

jest.mock('geist/font/sans', () => ({
  GeistSans: {
    className: 'geist-sans',
    variable: 'geist-sans-variable',
  },
}))

jest.mock('geist/font/mono', () => ({
  GeistMono: {
    variable: 'geist-mono-variable',
  },
}))

jest.mock('@/components/TerminalErrorPage', () => {
  return function MockTerminalErrorPage({
    statusCode,
    title,
    reset,
  }: {
    statusCode: string
    title: string
    reset?: () => void
  }) {
    return (
      <main>
        <h1>
          {statusCode}: {title}
        </h1>
        <p>command not found: /</p>
        {reset && (
          <button type="button" onClick={reset}>
            retry command
          </button>
        )}
      </main>
    )
  }
})

const { captureException } = jest.requireMock<{
  captureException: jest.Mock
}>('@sentry/nextjs')

describe('GlobalError', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('captures the error and renders the terminal fallback', () => {
    const error = new Error('Render failed')
    jest.spyOn(console, 'error').mockImplementation()

    render(<GlobalError error={error} reset={jest.fn()} />)

    expect(captureException).toHaveBeenCalledWith(error)
    expect(
      screen.getByRole('heading', { level: 1, name: /500: runtime error/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/command not found:/i)).toBeInTheDocument()
  })
})
