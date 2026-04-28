import { fireEvent, render, screen } from '@/__tests__/utils/test-utils'

import Header from './hero'
import NextLogo from './next-logo'
import { PasswordInput } from './password-input'
import SupabaseLogo from './supabase-logo'
import { TypographyInlineCode } from './typography/inline-code'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'

jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon" />,
  CheckCircle: () => <span data-testid="check-circle-icon" />,
  XCircle: () => <span data-testid="x-circle-icon" />,
}))

describe('auth leaf components', () => {
  it('renders password input with strength feedback and configured attributes', () => {
    render(
      <PasswordInput
        name="password"
        placeholder="Password"
        required
        minLength={12}
      />
    )

    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('minLength', '12')
    expect(input).toBeRequired()

    fireEvent.change(input, { target: { value: 'StrongPassword1!' } })

    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
  })

  it('renders badge variants with caller classes', () => {
    const { rerender } = render(
      <Badge variant="secondary" className="custom-class">
        Beta
      </Badge>
    )

    expect(screen.getByText('Beta')).toHaveClass('variant-secondary')
    expect(screen.getByText('Beta')).toHaveClass('custom-class')

    rerender(<Badge>Default</Badge>)

    expect(screen.getByText('Default')).toHaveClass('variant-default')
  })

  it('renders checkbox state and disabled attributes', () => {
    const { rerender } = render(<Checkbox aria-label="Remember me" />)

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeEnabled()

    rerender(<Checkbox aria-label="Remember me" disabled />)

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeDisabled()
  })

  it('renders inline code and starter template hero links', () => {
    render(
      <>
        <TypographyInlineCode />
        <Header />
      </>
    )

    expect(screen.getByText('@radix-ui/react-alert-dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Supabase and Next.js Starter Template',
      })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Supabase/i })[0])
      .toHaveAttribute('rel', 'noreferrer')
    expect(screen.getAllByRole('link', { name: /Next\.js/i })[0])
      .toHaveAttribute('target', '_blank')
  })

  it('renders provider logos with accessible names', () => {
    render(
      <>
        <NextLogo />
        <SupabaseLogo />
      </>
    )

    expect(screen.getByRole('img', { name: 'Next.js logotype' }))
      .toBeInTheDocument()
    expect(screen.getByLabelText('Supabase logo')).toBeInTheDocument()
  })
})
