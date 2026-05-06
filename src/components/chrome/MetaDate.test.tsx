import { render, screen } from '@testing-library/react'
import MetaDate from './MetaDate'

describe('MetaDate', () => {
  it('renders a <time> element with a parseable datetime attribute', () => {
    render(<MetaDate dateString="2025-01-15T12:00:00.000Z" />)

    const time = screen.getByText(/January\s+15,\s+2025/)
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2025-01-15T12:00:00.000Z')
  })

  it('formats the date with the default format string', () => {
    render(<MetaDate dateString="2025-06-30T12:00:00.000Z" />)

    expect(screen.getByText(/June\s+30,\s+2025/)).toBeInTheDocument()
  })

  it('honors a custom date-fns format string', () => {
    render(
      <MetaDate
        dateString="2025-01-15T12:00:00.000Z"
        formatString="yyyy"
      />
    )

    expect(screen.getByText('2025')).toBeInTheDocument()
  })
})
