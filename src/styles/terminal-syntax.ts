import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

/**
 * Shared monospace syntax-highlight spans.
 * Used by HeroTerminal and TerminalErrorPage.
 */

export const TerminalCommentText = styled('span')`
  color: ${Tokens.colors.roleInfo.var};
`

export const TerminalPromptText = styled('span')`
  color: ${Tokens.colors.rolePrompt.var};
`

export const TerminalCodeText = styled('span')`
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.roleBody.var};
`
