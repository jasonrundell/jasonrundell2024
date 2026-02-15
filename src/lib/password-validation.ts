export const MIN_PASSWORD_LENGTH = 8

export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
} as const

export const PASSWORD_REQUIREMENT_LABELS = {
  length: `at least ${MIN_PASSWORD_LENGTH} characters`,
  uppercase: 'at least one uppercase letter',
  lowercase: 'at least one lowercase letter',
  number: 'at least one number',
  special: 'at least one special character',
} as const

export type PasswordRequirementKey = keyof typeof PASSWORD_REQUIREMENT_LABELS

export type PasswordRequirementsState = Record<PasswordRequirementKey, boolean>

export function getPasswordRequirements(password: string): PasswordRequirementsState {
  return {
    length: password.length >= MIN_PASSWORD_LENGTH,
    uppercase: PASSWORD_PATTERNS.uppercase.test(password),
    lowercase: PASSWORD_PATTERNS.lowercase.test(password),
    number: PASSWORD_PATTERNS.number.test(password),
    special: PASSWORD_PATTERNS.special.test(password),
  }
}

export function getPasswordStrength(password: string): number {
  const requirements = getPasswordRequirements(password)
  const metRequirements = Object.values(requirements).filter(Boolean).length
  return (metRequirements / Object.keys(requirements).length) * 100
}

export function isPasswordValid(password: string): boolean {
  const requirements = getPasswordRequirements(password)
  return Object.values(requirements).every(Boolean)
}

export function getUnmetPasswordRequirementKeys(
  password: string
): PasswordRequirementKey[] {
  const requirements = getPasswordRequirements(password)
  return Object.entries(requirements)
    .filter(([, met]) => !met)
    .map(([requirement]) => requirement as PasswordRequirementKey)
}

export function getUnmetPasswordRequirementLabels(password: string): string[] {
  return getUnmetPasswordRequirementKeys(password).map(
    (requirement) => PASSWORD_REQUIREMENT_LABELS[requirement]
  )
}
