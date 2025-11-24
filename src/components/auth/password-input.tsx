'use client'

import { useState } from 'react'
import { Input } from '@/components/auth/ui/input'
import { PasswordStrength } from './password-strength'

interface PasswordInputProps {
  name: string
  placeholder: string
  required?: boolean
  minLength?: number
}

/**
 * Password input component with strength indicator.
 * Includes proper label for accessibility.
 */
export function PasswordInput({
  name,
  placeholder,
  required = false,
  minLength = 8,
}: PasswordInputProps) {
  const [password, setPassword] = useState('')

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <Input
        id={name}
        type="password"
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label={placeholder}
      />
      <PasswordStrength password={password} />
    </div>
  )
}
