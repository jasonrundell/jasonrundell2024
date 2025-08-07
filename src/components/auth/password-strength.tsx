import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setRequirements(newRequirements)

    const metRequirements =
      Object.values(newRequirements).filter(Boolean).length
    const newStrength = (metRequirements / 5) * 100
    setStrength(newStrength)
  }, [password])

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
