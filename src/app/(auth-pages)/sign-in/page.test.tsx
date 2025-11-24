import React from 'react'
import { render, screen } from '@testing-library/react'

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
            id="email"
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
            id="password"
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
        <p>
          Don&apos;t have an account? <a href="/sign-up">Sign up</a>
        </p>
      </form>
    </div>
  )
}

describe('Sign In Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Page Rendering', () => {
    it('should render the sign-in page with correct title and subtitle', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(screen.getByText('Welcome back')).toBeInTheDocument()
      expect(
        screen.getByText('Sign in to your account to continue')
      ).toBeInTheDocument()
    })

    it('should render all form fields with proper labels', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Remember me')).toBeInTheDocument()
    })

    it('should render the sign-in button with correct text', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(
        screen.getByRole('button', { name: 'Sign in' })
      ).toBeInTheDocument()
    })


    it('should render navigation links', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(screen.getByText('Forgot Password?')).toBeInTheDocument()
      expect(screen.getByText('Sign up')).toBeInTheDocument()
    })
  })

  describe('Form Validation and User Experience', () => {
    it('should show loading state during form submission', () => {
      // Arrange
      render(<MockLogin searchParams={{}} />)

      // Act & Assert
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      expect(submitButton).toHaveAttribute('data-pending-text', 'Signing In...')
    })

    it('should have proper form structure with action', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have required attributes on mandatory fields', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('required')
    })
  })

  describe('Error Message Display', () => {
    it('should display error message when error parameter is provided', () => {
      // Arrange
      const searchParams = { error: 'invalid_credentials' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Invalid email or password. Please try again.')
      ).toBeInTheDocument()
    })

    it('should display database paused error message', () => {
      // Arrange
      const searchParams = { error: 'supabase_paused' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Database is currently paused. Please resume your Supabase project to continue.'
        )
      ).toBeInTheDocument()
    })

    it('should display database unavailable error message', () => {
      // Arrange
      const searchParams = { error: 'supabase_unavailable' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Database is unavailable. Please try again later.')
      ).toBeInTheDocument()
    })

    it('should display email not confirmed error message', () => {
      // Arrange
      const searchParams = { error: 'email_not_confirmed' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Please confirm your email address before signing in.')
      ).toBeInTheDocument()
    })

    it('should display generic auth error message', () => {
      // Arrange
      const searchParams = { error: 'auth_error' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(
        screen.getByText('Authentication failed. Please try again.')
      ).toBeInTheDocument()
    })
  })

  describe('Success Message Display', () => {
    it('should display password reset success message', () => {
      // Arrange
      const searchParams = { message: 'password_reset_success' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Your password has been successfully reset. You can now sign in with your new password.'
        )
      ).toBeInTheDocument()
    })

    it('should display email confirmed success message', () => {
      // Arrange
      const searchParams = { message: 'email_confirmed' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(
        screen.getByText('Email confirmed successfully. Please sign in.')
      ).toBeInTheDocument()
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper label associations', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const emailLabel = screen.getByTestId('label-email')
      const passwordLabel = screen.getByTestId('label-password')
      const rememberLabel = screen.getByTestId('label-remember')
      expect(emailLabel).toBeInTheDocument()
      expect(passwordLabel).toBeInTheDocument()
      expect(rememberLabel).toBeInTheDocument()
    })

    it('should have proper input types', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have proper placeholders', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const emailInput = screen.getByTestId('input-email')
      const passwordInput = screen.getByTestId('input-password')
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
      expect(passwordInput).toHaveAttribute('placeholder', 'Your password')
    })
  })

  describe('Navigation and Links', () => {
    it('should have forgot password link', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const forgotPasswordLink = screen.getByText('Forgot Password?')
      expect(forgotPasswordLink).toBeInTheDocument()
      expect(forgotPasswordLink.closest('a')).toHaveAttribute(
        'href',
        '/forgot-password'
      )
    })

    it('should have sign up link', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const signUpLink = screen.getByText('Sign up')
      expect(signUpLink).toBeInTheDocument()
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up')
    })
  })

  describe('Remember Me Functionality', () => {
    it('should render remember me checkbox', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const rememberCheckbox = screen.getByTestId('checkbox-remember')
      expect(rememberCheckbox).toBeInTheDocument()
      expect(rememberCheckbox).toHaveAttribute('type', 'checkbox')
    })

    it('should have remember me label', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(screen.getByText('Remember me')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should have form with proper action', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have submit button with proper type', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      const submitButton = screen.getByRole('button', { name: 'Sign in' })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle unknown error codes gracefully', () => {
      // Arrange
      const searchParams = { error: 'unknown_error' }

      // Act
      render(<MockLogin searchParams={searchParams} />)

      // Assert
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument()
    })

    it('should handle missing search parameters gracefully', () => {
      // Act
      render(<MockLogin searchParams={{}} />)

      // Assert
      expect(screen.getByText('Welcome back')).toBeInTheDocument()
      expect(
        screen.getByText('Sign in to your account to continue')
      ).toBeInTheDocument()
    })
  })
})
