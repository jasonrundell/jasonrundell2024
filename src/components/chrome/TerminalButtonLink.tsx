import React from 'react'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledTerminalLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  padding: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfaceSecondary.var};
  color: ${Tokens.colors.ink.var};
  font-family: ${Tokens.fonts.body.family};
  text-decoration: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover,
  &:focus-visible {
    border-color: ${Tokens.colors.accent.var};
    box-shadow: inset 3px 0 0 0 ${Tokens.colors.accent.var};
  }
`

const StyledLabel = styled('span')`
  font-family: ${Tokens.fonts.heading.family};
  font-weight: 600;
  font-size: 1.25rem;
  color: ${Tokens.colors.ink.var};
`

const StyledDescription = styled('span')`
  font-family: ${Tokens.fonts.body.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.inkMuted.var};
`

interface TerminalButtonLinkProps {
  href: string
  label: string
  description?: string
  'aria-label'?: string
}

/**
 * Terminal-styled CTA link, presented like a `[ Label ]` button in monospaced
 * type with a gold border and inverted hover/focus state. Used for the
 * 3-doors row on `/` and any other primary terminal-style navigation.
 */
export default function TerminalButtonLink({
  href,
  label,
  description,
  'aria-label': ariaLabel,
}: TerminalButtonLinkProps) {
  return (
    <StyledTerminalLink href={href} aria-label={ariaLabel}>
      <StyledLabel>{label}</StyledLabel>
      {description && <StyledDescription>{description}</StyledDescription>}
    </StyledTerminalLink>
  )
}
