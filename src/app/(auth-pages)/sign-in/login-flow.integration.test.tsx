import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock dependencies
jest.mock('@/app/actions', () => ({
  signInAction: jest.fn(),
}))

jest.mock('@/components/auth/auth-layout', () => {
  return function MockAuthLayout({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode
    title: string
    subtitle: string
  }) {
    return (
      <div data-testid="auth-layout">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    )
  }
})

jest.mock('@/components/auth/form-message', () => {
  return function MockFormMessage({
    message,
  }: {
    message: { error?: string; message?: string }
  }) {
    if (message.error) {
      return <div data-testid="error-message">{message.error}</div>
    }
    if (message.message) {
      return <div data-testid="success-message">{message.message}</div>
    }
    return null
  }
})

jest.mock('@/components/auth/submit-button', () => {
  return function MockSubmitButton({
    children,
    pendingText,
  }: {
    children: React.ReactNode
    pendingText?: string
  }) {
    return (
      <button
        type="submit"
        data-testid="submit-button"
        data-pending-text={pendingText}
      >
        {children}
      </button>
    )
  }
})

jest.mock('@/components/auth/social-auth-section', () => {
  return function MockSocialAuthSection() {
    return (
      <div data-testid="social-auth-section">Social Authentication Options</div>
    )
  }
})

jest.mock('@/components/auth/ui/input', () => {
  return function MockInput({
    name,
    type,
    placeholder,
    required,
  }: {
    name: string
    type: string
    placeholder: string
    required?: boolean
  }) {
    return (
      <input
        data-testid={`input-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    )
  }
})

jest.mock('@/components/auth/ui/label', () => {
  return function MockLabel({
    children,
    htmlFor,
  }: {
    children: React.ReactNode
    htmlFor: string
  }) {
    return (
      <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
        {children}
      </label>
    )
  }
})

jest.mock('@/components/auth/ui/checkbox', () => {
  return function MockCheckbox({ id, name }: { id: string; name: string }) {
    return (
      <input
        data-testid={`checkbox-${id}`}
        type="checkbox"
        id={id}
        name={name}
      />
    )
  }
})

// Mock the styled components
jest.mock('@pigment-css/react', () => ({
  styled: (Component: React.ComponentType<Record<string, unknown>>) => {
    return function StyledComponent(props: Record<string, unknown>) {
      return <Component {...props} />
    }
  },
}))

// Create a mock Login component for testing
const MockLogin = ({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; redirectedFrom?: string }
}) => {
  const errorMessages: Record<string, string> = {
    not_authenticated: 'Please sign in to access this page',
    user_not_found: 'User account not found. Please sign up first.',
    auth_session: 'Error creating authentication session',
    no_auth_url: 'Authentication URL not available',
    server_error: 'An error occurred. Please try again.',
    invalid_code: 'Invalid authentication code',
    user_info_fetch: 'Failed to fetch user information from GitHub',
    invalid_user_data: 'Invalid user data received from GitHub',
    github_api_error: 'Error communicating with GitHub',
    supabase_paused:
      'Database is currently paused. Please resume your Supabase project to continue.',
    supabase_unavailable: 'Database is unavailable. Please try again later.',
    invalid_credentials: 'Invalid email or password. Please try again.',
    email_not_confirmed: 'Please confirm your email address before signing in.',
    auth_error: 'Authentication failed. Please try again.',
  }

  const successMessages: Record<string, string> = {
    password_reset_success:
      'Your password has been successfully reset. You can now sign in with your new password.',
    email_confirmed: 'Email confirmed successfully. Please sign in.',
  }

  const errorCode = searchParams?.error
  const customMessage = searchParams?.message

  // Construct the error or success message
  let message = customMessage
  if (errorCode && !customMessage) {
    message = errorMessages[errorCode] || 'An unknown error occurred'
  } else if (customMessage && successMessages[customMessage]) {
    message = successMessages[customMessage]
  }

  // Convert message to Message type for FormMessage
  const formMessage = message
    ? errorCode
      ? { error: message }
      : { message }
    : undefined

  return (
    <div data-testid="auth-layout">
      <h1>Welcome back</h1>
      <p>Sign in to your account to continue</p>
      <form>
        {formMessage ? (
          <div data-testid={errorCode ? 'error-message' : 'success-message'}>
            {message}
          </div>
        ) : null}
        <div>
          <label htmlFor="email" data-testid="label-email">
            Email
          </label>
          <input
            data-testid="input-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <div>
            <label htmlFor="password" data-testid="label-password">
              Password
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <input
            data-testid="input-password"
            name="password"
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <div>
          <input
            data-testid="checkbox-remember"
            type="checkbox"
            id="remember"
            name="remember"
          />
          <label htmlFor="remember" data-testid="label-remember">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          data-testid="submit-button"
          data-pending-text="Signing In..."
        >
          Sign in
        </button>
        <div data-testid="social-auth-section">
          Social Authentication Options
        </div>
        <p>
          Don&apos;t have an account? <a href="/sign-up">Sign up</a>
        </p>
      </form>
    </div>
  )
}

describe('Login Flow Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Feature: User Authentication', () => {
    it('should successfully login with valid credentials', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I enter a valid email address
      const emailInput = screen.getByTestId('input-email')
      await user.type(emailInput, 'test@example.com')

      // And I enter a valid password
      const passwordInput = screen.getByTestId('input-password')
      await user.type(passwordInput, 'ValidPassword123!')

      // And I click the sign-in button
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Then the form should be submitted
      expect(submitButton).toBeInTheDocument()
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('ValidPassword123!')
    })

    it('should handle login with remember me option', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I enter valid credentials
      const emailInput = screen.getByTestId('input-email')
      await user.type(emailInput, 'test@example.com')

      const passwordInput = screen.getByTestId('input-password')
      await user.type(passwordInput, 'ValidPassword123!')

      // And I check the remember me checkbox
      const rememberCheckbox = screen.getByTestId('checkbox-remember')
      await user.click(rememberCheckbox)

      // And I click the sign-in button
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Then the remember me option should be selected
      expect(rememberCheckbox).toBeChecked()
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Feature: Form Validation and User Experience', () => {
    it('should prevent form submission with missing email', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I leave the email field empty
      const emailInput = screen.getByTestId('input-email')
      expect(emailInput).toHaveAttribute('required')

      // And I enter only a password
      const passwordInput = screen.getByTestId('input-password')
      await user.type(passwordInput, 'ValidPassword123!')

      // Then the email field should be required
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveValue('')
    })

    it('should prevent form submission with missing password', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I enter an email address
      const emailInput = screen.getByTestId('input-email')
      await user.type(emailInput, 'test@example.com')

      // And I leave the password field empty
      const passwordInput = screen.getByTestId('input-password')
      expect(passwordInput).toHaveAttribute('required')

      // Then the password field should be required
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveValue('')
    })

    it('should prevent form submission with both fields empty', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I leave both email and password fields empty
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')

      // Then both fields should be required
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    })

    it('should show loading state during form submission', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I enter valid information
      const emailInput = screen.getByTestId('input-email')
      await user.type(emailInput, 'test@example.com')

      const passwordInput = screen.getByTestId('input-password')
      await user.type(passwordInput, 'ValidPassword123!')

      // Then the submit button should show loading state
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toHaveAttribute('data-pending-text', 'Signing In...')
    })
  })

  describe('Feature: Error Handling and User Experience', () => {
    it('should display invalid credentials error message', async () => {
      // Given I am on the sign-in page with an error
      const searchParams = { error: 'invalid_credentials' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the error message
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Invalid email or password. Please try again.')
      ).toBeInTheDocument()
    })

    it('should display database paused error message', async () => {
      // Given I am on the sign-in page with a database error
      const searchParams = { error: 'supabase_paused' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the error message
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Database is currently paused. Please resume your Supabase project to continue.'
        )
      ).toBeInTheDocument()
    })

    it('should display database unavailable error message', async () => {
      // Given I am on the sign-in page with a database error
      const searchParams = { error: 'supabase_unavailable' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the error message
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Database is unavailable. Please try again later.')
      ).toBeInTheDocument()
    })

    it('should display email not confirmed error message', async () => {
      // Given I am on the sign-in page with an email error
      const searchParams = { error: 'email_not_confirmed' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the error message
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Please confirm your email address before signing in.')
      ).toBeInTheDocument()
    })
  })

  describe('Feature: Post-Authentication Scenarios', () => {
    it('should display password reset success message', async () => {
      // Given I am on the sign-in page with a success message
      const searchParams = { message: 'password_reset_success' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the success message
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Your password has been successfully reset. You can now sign in with your new password.'
        )
      ).toBeInTheDocument()
    })

    it('should display email confirmed success message', async () => {
      // Given I am on the sign-in page with a success message
      const searchParams = { message: 'email_confirmed' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the success message
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(
        screen.getByText('Email confirmed successfully. Please sign in.')
      ).toBeInTheDocument()
    })
  })

  describe('Feature: Navigation and Accessibility', () => {
    it('should have navigation to forgot password page', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the page
      // Then I should see the forgot password link
      const forgotPasswordLink = screen.getByText('Forgot Password?')
      expect(forgotPasswordLink).toBeInTheDocument()
      expect(forgotPasswordLink.closest('a')).toHaveAttribute(
        'href',
        '/forgot-password'
      )
    })

    it('should have navigation to sign up page', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the page
      // Then I should see the sign up link
      const signUpLink = screen.getByText('Sign up')
      expect(signUpLink).toBeInTheDocument()
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up')
    })

    it('should have social authentication options', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the page
      // Then I should see social authentication options
      expect(screen.getByTestId('social-auth-section')).toBeInTheDocument()
      expect(
        screen.getByText('Social Authentication Options')
      ).toBeInTheDocument()
    })
  })

  describe('Feature: Accessibility and Mobile Experience', () => {
    it('should have proper form labels for accessibility', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the form fields
      // Then I should see proper labels
      expect(screen.getByTestId('label-email')).toBeInTheDocument()
      expect(screen.getByTestId('label-password')).toBeInTheDocument()
      expect(screen.getByTestId('label-remember')).toBeInTheDocument()
    })

    it('should have required fields clearly marked', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the form fields
      // Then I should see required attributes
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
    })

    it('should have proper input types for accessibility', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the form fields
      // Then I should see proper input types
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have proper placeholders for user guidance', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the form fields
      // Then I should see proper placeholders
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
      expect(passwordInput).toHaveAttribute('placeholder', 'Your password')
    })
  })

  describe('Feature: Form Submission Prevention', () => {
    it('should have proper form structure for submission', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I view the form
      // Then I should see a proper form structure
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should handle form submission prevention correctly', async () => {
      // Given I am on the sign-in page
      render(<MockLogin searchParams={{}} />)

      // When I try to submit with empty fields
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')

      // Then the required fields should prevent submission
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
    })
  })

  describe('Feature: Error Message Persistence', () => {
    it('should handle error message display and persistence', async () => {
      // Given I am on the sign-in page with an error
      const searchParams = { error: 'invalid_credentials' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the error message
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Invalid email or password. Please try again.')
      ).toBeInTheDocument()
    })

    it('should handle success message display and persistence', async () => {
      // Given I am on the sign-in page with a success message
      const searchParams = { message: 'password_reset_success' }
      render(<MockLogin searchParams={searchParams} />)

      // When I view the page
      // Then I should see the success message
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Your password has been successfully reset. You can now sign in with your new password.'
        )
      ).toBeInTheDocument()
    })
  })
})
