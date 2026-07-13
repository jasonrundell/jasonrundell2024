import { fireEvent, render, screen } from '@testing-library/react'

import { SubmitButton } from './submit-button'

jest.mock('@/components/auth/ui/button', () => ({
  Button: ({
    children,
    disabled,
    type,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    disabled?: boolean
    type?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    [key: string]: unknown
  }) => (
    <button type={type} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('SubmitButton', () => {
  it('renders children when idle', () => {
    render(
      <form>
        <SubmitButton>Sign in</SubmitButton>
      </form>
    )

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
  })

  it('enters pending state when the parent form is valid', () => {
    render(
      <form>
        <input name="email" defaultValue="a@b.com" required />
        <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
      </form>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      screen.getByRole('button', { name: 'Signing In...' })
    ).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('does not stay pending when native validation blocks submit', () => {
    render(
      <form>
        <input name="email" required />
        <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
      </form>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
  })

  it('respects an explicit disabled prop', () => {
    render(
      <form>
        <SubmitButton disabled>Save</SubmitButton>
      </form>
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('does not enter pending when clicked outside a form', () => {
    render(<SubmitButton>Change Password</SubmitButton>)

    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    expect(
      screen.getByRole('button', { name: 'Change Password' })
    ).toBeEnabled()
  })
})
