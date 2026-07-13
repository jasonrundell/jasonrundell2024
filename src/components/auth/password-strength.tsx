import { CheckCircle, XCircle } from 'lucide-react'
import {
  getPasswordRequirements,
  getPasswordStrength,
} from '@/lib/password-validation'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = getPasswordRequirements(password)
  const strength = getPasswordStrength(password)
  const strengthColor =
    strength < 33 ? '#8a5a00' : strength < 66 ? '#1f4d3a' : '#166534'

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div
        role="progressbar"
        aria-valuenow={strength}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Password strength"
        style={{
          height: '4px',
          backgroundColor: '#e5e7eb',
          borderRadius: '2px',
          marginBottom: '1rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${strength}%`,
            backgroundColor: strengthColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <ul aria-live="polite" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {requirements.length ? (
            <CheckCircle aria-hidden="true" size={16} />
          ) : (
            <XCircle aria-hidden="true" size={16} />
          )}
          <span>{requirements.length ? 'Met:' : 'Required:'} At least 8 characters</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {requirements.uppercase ? (
            <CheckCircle aria-hidden="true" size={16} />
          ) : (
            <XCircle aria-hidden="true" size={16} />
          )}
          <span>{requirements.uppercase ? 'Met:' : 'Required:'} At least one uppercase letter</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {requirements.lowercase ? (
            <CheckCircle aria-hidden="true" size={16} />
          ) : (
            <XCircle aria-hidden="true" size={16} />
          )}
          <span>{requirements.lowercase ? 'Met:' : 'Required:'} At least one lowercase letter</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {requirements.number ? (
            <CheckCircle aria-hidden="true" size={16} />
          ) : (
            <XCircle aria-hidden="true" size={16} />
          )}
          <span>{requirements.number ? 'Met:' : 'Required:'} At least one number</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {requirements.special ? (
            <CheckCircle aria-hidden="true" size={16} />
          ) : (
            <XCircle aria-hidden="true" size={16} />
          )}
          <span>{requirements.special ? 'Met:' : 'Required:'} At least one special character</span>
        </li>
      </ul>
    </div>
  )
}
