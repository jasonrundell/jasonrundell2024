import { styled } from '@pigment-css/react'
import { SubmitButton } from './submit-button'
import Tokens from '@/lib/tokens'

/**
 * Shared form-level layout primitives used across all auth pages
 * (sign-in, sign-up, forgot-password, reset-password).
 *
 * Per CONVENTIONS.md: any styled pattern repeated 3+ times across files
 * must be hoisted to a shared module.
 */

export const AuthFormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

export const AuthFieldGroup = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`

export const AuthFullWidthButton = styled(SubmitButton)`
  width: 100%;
`

export const AuthFooterText = styled('p')`
  text-align: center;
  color: ${Tokens.colors.textSecondary.var};
  font-size: 1rem;
  margin-top: 1.5rem;
`
