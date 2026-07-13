import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

/**
 * Shared terminal-chrome styled primitives.
 * Used by TerminalErrorPage and TerminalButtonLink (gold-border CTA style).
 */

export const TerminalCtaBase = `
  display: inline-flex;
  align-items: center;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  padding: ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit} ${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit};
  border: 1px solid ${Tokens.colors.rolePrompt.var};
  color: ${Tokens.colors.rolePrompt.var};
  background: transparent;
  cursor: pointer;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  text-decoration: none;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
  transition: background 0.15s, color 0.15s;

  &:hover,
  &:focus-visible {
    background: ${Tokens.colors.rolePrompt.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
`

export const StyledTerminalLink = styled('a')`${TerminalCtaBase}`

export const StyledTerminalButton = styled('button')`${TerminalCtaBase}`
