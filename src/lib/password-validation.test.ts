import {
  MIN_PASSWORD_LENGTH,
  getPasswordRequirements,
  getPasswordStrength,
  getUnmetPasswordRequirementKeys,
  getUnmetPasswordRequirementLabels,
  isPasswordValid,
} from './password-validation'

describe('password-validation', () => {
  it('returns requirement flags for a weak password', () => {
    expect(getPasswordRequirements('abc')).toEqual({
      length: false,
      uppercase: false,
      lowercase: true,
      number: false,
      special: false,
    })
  })

  it('returns all requirements as true for a valid password', () => {
    expect(getPasswordRequirements('Strong1!Password')).toEqual({
      length: true,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
    })
  })

  it('calculates password strength as a percentage', () => {
    expect(getPasswordStrength('A')).toBe(20)
    expect(getPasswordStrength('ABa1')).toBe(60)
    expect(getPasswordStrength('AB1!abcd')).toBe(100)
  })

  it('returns invalid when any requirement is unmet', () => {
    expect(isPasswordValid('NoSpecial123')).toBe(false)
    expect(isPasswordValid('Aa1!aaaa')).toBe(true)
  })

  it('returns unmet requirement keys and labels in deterministic order', () => {
    expect(getUnmetPasswordRequirementKeys('abc')).toEqual([
      'length',
      'uppercase',
      'number',
      'special',
    ])
    expect(getUnmetPasswordRequirementLabels('abc')).toEqual([
      `at least ${MIN_PASSWORD_LENGTH} characters`,
      'at least one uppercase letter',
      'at least one number',
      'at least one special character',
    ])
  })
})
