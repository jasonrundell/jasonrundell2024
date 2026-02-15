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

  const getStrengthColor = (strength: number) => {
    if (strength < 33) return 'bg-warning'
    if (strength < 66) return 'bg-accent'
    return 'bg-success'
  }

  return (
    <div className="mt-3">
      <div className="h-1 bg-background-dark rounded-sm mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor(
            strength
          )}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <ul className="list-none p-0 m-0 text-sm text-text-secondary space-y-1">
        <li className="flex items-center gap-2">
          {requirements.length ? (
            <CheckCircle className="text-success w-4 h-4" />
          ) : (
            <XCircle className="text-warning w-4 h-4" />
          )}
          <span>At least 8 characters</span>
        </li>
        <li className="flex items-center gap-2">
          {requirements.uppercase ? (
            <CheckCircle className="text-success w-4 h-4" />
          ) : (
            <XCircle className="text-warning w-4 h-4" />
          )}
          <span>At least one uppercase letter</span>
        </li>
        <li className="flex items-center gap-2">
          {requirements.lowercase ? (
            <CheckCircle className="text-success w-4 h-4" />
          ) : (
            <XCircle className="text-warning w-4 h-4" />
          )}
          <span>At least one lowercase letter</span>
        </li>
        <li className="flex items-center gap-2">
          {requirements.number ? (
            <CheckCircle className="text-success w-4 h-4" />
          ) : (
            <XCircle className="text-warning w-4 h-4" />
          )}
          <span>At least one number</span>
        </li>
        <li className="flex items-center gap-2">
          {requirements.special ? (
            <CheckCircle className="text-success w-4 h-4" />
          ) : (
            <XCircle className="text-warning w-4 h-4" />
          )}
          <span>At least one special character</span>
        </li>
      </ul>
    </div>
  )
}
