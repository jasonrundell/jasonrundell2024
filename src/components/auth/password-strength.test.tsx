import { render, screen } from '@testing-library/react'
import { PasswordStrength } from './password-strength'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className }: { className: string }) => (
    <div className={className} data-testid="check-circle">
      ✓
    </div>
  ),
  XCircle: ({ className }: { className: string }) => (
    <div className={className} data-testid="x-circle">
      ✗
    </div>
  ),
}))

describe('Password Strength Component', () => {
  describe('Feature: Password Strength Calculation', () => {
    it('should show password strength bar', () => {
      render(<PasswordStrength password="test" />)
      const strengthBar = document.querySelector('.h-1')
      expect(strengthBar).toBeInTheDocument()
    })

    it('should calculate 20% strength for password meeting one requirement', () => {
      render(<PasswordStrength password="A" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '20%' })
    })

    it('should calculate 40% strength for password meeting two requirements', () => {
      render(<PasswordStrength password="ABa" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '40%' })
    })

    it('should calculate 60% strength for password meeting three requirements', () => {
      render(<PasswordStrength password="ABa1" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '60%' })
    })

    it('should calculate 80% strength for password meeting four requirements', () => {
      render(<PasswordStrength password="ABa1!" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '80%' })
    })

    it('should calculate 100% strength for password meeting all requirements', () => {
      render(<PasswordStrength password="AB1!abcd" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Feature: Individual Requirement Validation', () => {
    it('should show length requirement as met when password has 8+ characters', () => {
      render(<PasswordStrength password="ABCDEFGH" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
      expect(checkCircles[0]).toHaveClass('text-success')
    })

    it('should show length requirement as unmet when password has less than 8 characters', () => {
      render(<PasswordStrength password="ABCD" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
      expect(xCircles[0]).toHaveClass('text-warning')
    })

    it('should show uppercase requirement as met when password has uppercase letter', () => {
      render(<PasswordStrength password="aB" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
      expect(checkCircles[0]).toHaveClass('text-success')
    })

    it('should show uppercase requirement as unmet when password has no uppercase letter', () => {
      render(<PasswordStrength password="abc" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
      expect(xCircles[0]).toHaveClass('text-warning')
    })

    it('should show lowercase requirement as met when password has lowercase letter', () => {
      render(<PasswordStrength password="ABa" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
      expect(checkCircles[0]).toHaveClass('text-success')
    })

    it('should show lowercase requirement as unmet when password has no lowercase letter', () => {
      render(<PasswordStrength password="ABC" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
      expect(xCircles[0]).toHaveClass('text-warning')
    })

    it('should show number requirement as met when password has number', () => {
      render(<PasswordStrength password="ABa1" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
      expect(checkCircles[0]).toHaveClass('text-success')
    })

    it('should show number requirement as unmet when password has no number', () => {
      render(<PasswordStrength password="ABab" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
      expect(xCircles[0]).toHaveClass('text-warning')
    })

    it('should show special character requirement as met when password has special character', () => {
      render(<PasswordStrength password="ABa1!" />)
      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBeGreaterThan(0)
      expect(checkCircles[0]).toHaveClass('text-success')
    })

    it('should show special character requirement as unmet when password has no special character', () => {
      render(<PasswordStrength password="ABa12" />)
      const xCircles = screen.getAllByTestId('x-circle')
      expect(xCircles.length).toBeGreaterThan(0)
      expect(xCircles[0]).toHaveClass('text-warning')
    })
  })

  describe('Feature: Strength Bar Colors', () => {
    it('should show warning color for low strength passwords', () => {
      render(<PasswordStrength password="A" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveClass('bg-warning')
    })

    it('should show accent color for medium strength passwords', () => {
      render(<PasswordStrength password="ABa1" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveClass('bg-accent')
    })

    it('should show success color for high strength passwords', () => {
      render(<PasswordStrength password="AB1!abcd" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveClass('bg-success')
    })
  })

  describe('Feature: Real-time Updates', () => {
    it('should update requirement indicators when password changes', () => {
      const { rerender } = render(<PasswordStrength password="A" />)

      // Initially only uppercase requirement is met
      expect(screen.getAllByTestId('check-circle')).toHaveLength(1)
      expect(screen.getAllByTestId('x-circle')).toHaveLength(4)

      // Update password to meet some requirements
      rerender(<PasswordStrength password="ABa1" />)
      expect(screen.getAllByTestId('check-circle')).toHaveLength(3)
      expect(screen.getAllByTestId('x-circle')).toHaveLength(2)

      // Update password to meet all requirements
      rerender(<PasswordStrength password="AB1!abcd" />)
      expect(screen.getAllByTestId('check-circle')).toHaveLength(5)
      expect(screen.queryAllByTestId('x-circle')).toHaveLength(0)
    })

    it('should update strength bar width when password changes', () => {
      const { rerender } = render(<PasswordStrength password="A" />)

      // Initially 20% strength (1/5 requirements)
      let strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '20%' })

      // Update to 60% strength (3/5 requirements)
      rerender(<PasswordStrength password="ABa1" />)
      strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '60%' })

      // Update to 100% strength (5/5 requirements)
      rerender(<PasswordStrength password="AB1!abcd" />)
      strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Feature: Edge Cases and Special Characters', () => {
    it('should handle empty password', () => {
      render(<PasswordStrength password="" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '0%' })
      expect(screen.getAllByTestId('x-circle')).toHaveLength(5)
    })

    it('should handle passwords with mixed case and numbers', () => {
      render(<PasswordStrength password="ABa1" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '60%' }) // Length + uppercase + lowercase + number
    })

    it('should handle very long passwords', () => {
      render(<PasswordStrength password="VeryLongPassword123!" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '100%' })
    })

    it('should handle special characters correctly', () => {
      render(<PasswordStrength password="Test@123" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Feature: Accessibility and UI', () => {
    it('should have proper list structure', () => {
      render(<PasswordStrength password="test" />)
      const list = document.querySelector('ul')
      expect(list).toBeInTheDocument()
      expect(list).toHaveClass('list-none', 'p-0', 'm-0')
    })

    it('should have proper spacing between list items', () => {
      render(<PasswordStrength password="test" />)
      const list = document.querySelector('ul')
      expect(list).toHaveClass('space-y-1')
    })

    it('should have proper text styling', () => {
      render(<PasswordStrength password="test" />)
      const list = document.querySelector('ul')
      expect(list).toHaveClass('text-sm', 'text-text-secondary')
    })

    it('should have smooth transitions', () => {
      render(<PasswordStrength password="test" />)
      const strengthBar = document.querySelector('.h-full')
      expect(strengthBar).toHaveClass('transition-all', 'duration-300')
    })
  })
})
