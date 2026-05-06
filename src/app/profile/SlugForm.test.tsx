import { render, screen } from '@testing-library/react'
import SlugForm from './SlugForm'

jest.mock('lucide-react', () => ({
  User: () => <span data-testid="icon-user" />,
}))

jest.mock('@/app/actions', () => ({
  updateProfileSlugAction: jest.fn(),
}))

jest.mock('@/components/auth/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

jest.mock('@/components/auth/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/components/auth/submit-button', () => ({
  SubmitButton: ({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) => (
    <button disabled={disabled}>{children}</button>
  ),
}))

jest.mock('./profile-styles', () => ({
  AccountInfoSection: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  SectionTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  InfoCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoCardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoValue: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyledInfoLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  ProfileForm: ({ children }: { children: React.ReactNode; action?: unknown }) => (
    <form onSubmit={() => {}}>{children}</form>
  ),
  FormRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ButtonGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoBox: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InfoBoxTitle: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
  InfoBoxText: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <p id={id}>{children}</p>
  ),
}))

describe('SlugForm', () => {
  it('renders no-slug state when profileSlug is undefined', () => {
    render(<SlugForm canChange={false} />)
    expect(
      screen.getByText(/not available yet/i)
    ).toBeInTheDocument()
  })

  it('renders current slug link when slug is provided', () => {
    render(<SlugForm profileSlug="jane-doe" canChange={true} />)
    expect(screen.getByRole('link', { name: /jane-doe/i })).toHaveAttribute(
      'href',
      '/u/jane-doe'
    )
  })

  it('renders next change date when canChange is false', () => {
    const nextChangeAt = new Date('2026-06-01')
    render(
      <SlugForm profileSlug="jane-doe" canChange={false} nextChangeAt={nextChangeAt} />
    )
    expect(screen.getByText(/next change available on/i)).toBeInTheDocument()
  })

  it('renders the slug input disabled when canChange is false', () => {
    render(<SlugForm profileSlug="test-slug" canChange={false} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
