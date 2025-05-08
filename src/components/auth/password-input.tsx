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

export function PasswordInput({
  name,
  placeholder,
  required = false,
  minLength = 8,
}: PasswordInputProps) {
  const [password, setPassword] = useState('')

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="password"
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrength password={password} />
    </div>
  )
}
