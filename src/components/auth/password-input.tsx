'use client'

import { useState } from 'react'
import { Input } from '@/components/auth/ui/input'
import { PasswordStrength } from './password-strength'

interface PasswordInputProps {
  name: string
  placeholder: string
  required?: boolean
  minLength?: number
  'data-sentry-mask'?: boolean
}

/**
 * Password input with strength indicator. The external visible `<Label>`
 * in the form provides the accessible name via `htmlFor`/`id`.
 */
export function PasswordInput({
  name,
  placeholder,
  required = false,
  minLength = 8,
  ...rest
}: PasswordInputProps) {
  const [password, setPassword] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Input
        id={name}
        type="password"
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        {...rest}
      />
      <PasswordStrength password={password} />
    </div>
  )
}
