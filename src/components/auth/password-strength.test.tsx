import { render, screen } from '@testing-library/react'
import { PasswordStrength } from './password-strength'

jest.mock('lucide-react', () => ({
  CheckCircle: (props: Record<string, unknown>) => (
    <svg data-testid="check-circle" {...props} />
  ),
  XCircle: (props: Record<string, unknown>) => (
    <svg data-testid="x-circle" {...props} />
  ),
}))

describe('Password Strength Component', () => {
  describe('Feature: Password Strength Calculation', () => {
    it('should show password strength progressbar', () => {
      render(<PasswordStrength password="test" />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should calculate 20% strength for password meeting one requirement', () => {
      render(<PasswordStrength password="A" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '20'
      )
    })

    it('should calculate 40% strength for password meeting two requirements', () => {
      render(<PasswordStrength password="ABa" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '40'
      )
    })

    it('should calculate 60% strength for password meeting three requirements', () => {
      render(<PasswordStrength password="ABa1" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '60'
      )
    })

    it('should calculate 80% strength for password meeting four requirements', () => {
      render(<PasswordStrength password="ABa1!" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '80'
      )
    })

    it('should calculate 100% strength for password meeting all requirements', () => {
      render(<PasswordStrength password="AB1!abcd" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      )
    })
  })

  describe('Feature: Individual Requirement Validation', () => {
    it('should show length requirement as met when password has 8+ characters', () => {
      render(<PasswordStrength password="ABCDEFGH" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
    })

    it('should show length requirement as unmet when password has less than 8 characters', () => {
      render(<PasswordStrength password="ABCD" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
    })

    it('should show uppercase requirement as met when password has uppercase letter', () => {
      render(<PasswordStrength password="aB" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
    })

    it('should show uppercase requirement as unmet when password has no uppercase letter', () => {
      render(<PasswordStrength password="abc" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
    })

    it('should show lowercase requirement as met when password has lowercase letter', () => {
      render(<PasswordStrength password="ABa" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
    })

    it('should show lowercase requirement as unmet when password has no lowercase letter', () => {
      render(<PasswordStrength password="ABC" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
    })

    it('should show number requirement as met when password has number', () => {
      render(<PasswordStrength password="ABa1" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
    })

    it('should show number requirement as unmet when password has no number', () => {
      render(<PasswordStrength password="ABab" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
    })

    it('should show special character requirement as met when password has special character', () => {
      render(<PasswordStrength password="ABa1!" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
    })

    it('should show special character requirement as unmet when password has no special character', () => {
      render(<PasswordStrength password="ABa12" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
    })
  })

  describe('Feature: Real-time Updates', () => {
    it('should update requirement indicators when password changes', () => {
      const { rerender } = render(<PasswordStrength password="A" />)
      expect(screen.getAllByTestId('check-circle')).toHaveLength(1)
      expect(screen.getAllByTestId('x-circle')).toHaveLength(4)

      rerender(<PasswordStrength password="ABa1" />)
      expect(screen.getAllByTestId('check-circle')).toHaveLength(3)
      expect(screen.getAllByTestId('x-circle')).toHaveLength(2)

      rerender(<PasswordStrength password="AB1!abcd" />)
      expect(screen.getAllByTestId('check-circle')).toHaveLength(5)
      expect(screen.queryAllByTestId('x-circle')).toHaveLength(0)
    })

    it('should update strength bar value when password changes', () => {
      const { rerender } = render(<PasswordStrength password="A" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '20'
      )

      rerender(<PasswordStrength password="ABa1" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '60'
      )

      rerender(<PasswordStrength password="AB1!abcd" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      )
    })
  })

  describe('Feature: Edge Cases and Special Characters', () => {
    it('should handle empty password', () => {
      render(<PasswordStrength password="" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '0'
      )
      expect(screen.getAllByTestId('x-circle')).toHaveLength(5)
    })

    it('should handle passwords with mixed case and numbers', () => {
      render(<PasswordStrength password="ABa1" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '60'
      )
    })

    it('should handle very long passwords', () => {
      render(<PasswordStrength password="VeryLongPassword123!" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      )
    })

    it('should handle special characters correctly', () => {
      render(<PasswordStrength password="Test@123" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '100'
      )
    })
  })

  describe('Feature: Accessibility', () => {
    it('should have proper list structure', () => {
      render(<PasswordStrength password="test" />)
      const list = document.querySelector('ul')
      expect(list).toBeInTheDocument()
    })

    it('should have aria-label on progressbar', () => {
      render(<PasswordStrength password="test" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-label',
        'Password strength'
      )
    })

    it('should have decorative icons hidden from screen readers', () => {
      render(<PasswordStrength password="A" />)
      const allIcons = [
        ...screen.getAllByTestId('check-circle'),
        ...screen.getAllByTestId('x-circle'),
      ]
      allIcons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })
})
