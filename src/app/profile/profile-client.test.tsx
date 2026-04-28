import { fireEvent, render, screen } from '@/__tests__/utils/test-utils'

import ProfileClient from './profile-client'

jest.mock('@/app/actions', () => ({
  changePasswordAction: jest.fn(),
  updateDisplayNameAction: jest.fn(),
  updateProfileSlugAction: jest.fn(),
}))

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
  CheckCircle: () => <span data-testid="check-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
  Lock: () => <span data-testid="lock-icon" />,
  Mail: () => <span data-testid="mail-icon" />,
  Shield: () => <span data-testid="shield-icon" />,
  User: () => <span data-testid="user-icon" />,
  XCircle: () => <span data-testid="x-icon" />,
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

const user = {
  email: 'jason@example.com',
  id: 'auth-user-id',
  app_metadata: {
    provider: 'github',
  },
}

const userData = {
  full_name: 'Jason Rundell',
  created_at: '2025-01-15T12:00:00.000Z',
  profile_slug: 'jason-rundell',
  profile_slug_changed_at: null,
}

describe('ProfileClient', () => {
  it('renders account, display name, profile URL, and password summary', () => {
    render(<ProfileClient user={user} userData={userData} signOutAction={jest.fn()} />)

    expect(screen.getByText('Welcome, Jason Rundell')).toBeInTheDocument()
    expect(screen.getAllByText('jason@example.com')).toHaveLength(2)
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('github')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '/u/jason-rundell' })).toHaveAttribute(
      'href',
      '/u/jason-rundell'
    )
    expect(screen.getByText('••••••••')).toBeInTheDocument()
  })

  it('falls back to email name and unknown metadata when user data is missing', () => {
    render(<ProfileClient user={user} signOutAction={jest.fn()} />)

    expect(screen.getByText('Welcome, jason')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(
      screen.getByText(/Your profile URL is not available yet/i)
    ).toBeInTheDocument()
  })

  it('allows editing and cancelling the display name form', () => {
    render(<ProfileClient user={user} userData={userData} signOutAction={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const input = screen.getByLabelText('Display Name')
    expect(input).toHaveValue('Jason Rundell')
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()

    fireEvent.change(input, { target: { value: 'J' } })
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByLabelText('Display Name')).not.toBeInTheDocument()
    expect(screen.getByText('Jason Rundell')).toBeInTheDocument()
  })

  it('disables profile slug editing when the cooldown is active', () => {
    render(
      <ProfileClient
        user={user}
        userData={{
          ...userData,
          profile_slug_changed_at: new Date().toISOString(),
        }}
        signOutAction={jest.fn()}
      />
    )

    expect(screen.getByLabelText('Profile URL slug')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save profile URL' })).toBeDisabled()
    expect(screen.getByText(/Next change available on/i)).toBeInTheDocument()
  })

  it('shows password requirements and validates password match state', () => {
    render(<ProfileClient user={user} userData={userData} signOutAction={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    expect(screen.getByText('Password Requirements')).toBeInTheDocument()
    expect(screen.getByLabelText('Current Password')).toHaveAttribute(
      'type',
      'password'
    )

    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'OldPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'Mismatch1!' },
    })

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'NewPassword1!' },
    })

    expect(screen.getByText('Passwords match')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeEnabled()
  })

  it('toggles password visibility and resets the password form on cancel', () => {
    render(<ProfileClient user={user} userData={userData} signOutAction={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    const currentPassword = screen.getByLabelText('Current Password')
    fireEvent.change(currentPassword, { target: { value: 'OldPassword1!' } })

    fireEvent.click(screen.getAllByRole('button', { name: 'Show password' })[0])
    expect(currentPassword).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getAllByRole('button', { name: 'Hide password' })[0])
    expect(currentPassword).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByLabelText('Current Password')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Change Password' })).toBeInTheDocument()
  })
})
