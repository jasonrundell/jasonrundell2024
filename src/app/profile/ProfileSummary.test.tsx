import { render, screen } from '@testing-library/react'
import ProfileSummary from './ProfileSummary'

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="icon-calendar" />,
  Mail: () => <span data-testid="icon-mail" />,
  Shield: () => <span data-testid="icon-shield" />,
  User: () => <span data-testid="icon-user" />,
}))

jest.mock('@/components/auth/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}))

jest.mock('./profile-styles', () => ({
  UserInfoSection: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  UserAvatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserName: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  UserEmail: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AccountInfoSection: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  SectionTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  InfoGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoCardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoValue: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyledInfoLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  StyledInfoValueCapitalize: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ProfileSummary', () => {
  const props = {
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    accountCreated: 'January 1, 2026',
    authMethod: 'email',
  }

  it('renders the welcome heading with the display name', () => {
    render(<ProfileSummary {...props} />)
    expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument()
  })

  it('renders email address', () => {
    render(<ProfileSummary {...props} />)
    expect(screen.getAllByText('jane@example.com')).toHaveLength(2)
  })

  it('renders account creation date', () => {
    render(<ProfileSummary {...props} />)
    expect(screen.getByText('January 1, 2026')).toBeInTheDocument()
  })

  it('renders auth method', () => {
    render(<ProfileSummary {...props} />)
    expect(screen.getByText('email')).toBeInTheDocument()
  })

  it('shows correct avatar initial', () => {
    render(<ProfileSummary {...props} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})
