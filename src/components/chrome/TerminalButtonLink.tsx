import React from 'react'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledTerminalLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  padding: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  border: 1px solid ${Tokens.colors.rolePrompt.var};
  background-color: ${Tokens.colors.surfaceBase.var};
  color: ${Tokens.colors.roleHeading.var};
  font-family: ${Tokens.fonts.monospace.family};
  text-decoration: none;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
  transition: background-color 0.15s ease, color 0.15s ease,
    border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Tokens.colors.rolePrompt.var};
    color: ${Tokens.colors.surfaceBase.var};
    border-color: ${Tokens.colors.rolePrompt.var};
  }
`

const StyledLabel = styled('span')`
  font-weight: 600;
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};

  &::before {
    content: '[ ';
    color: ${Tokens.colors.rolePrompt.var};
    font-weight: 400;
  }

  &::after {
    content: ' ]';
    color: ${Tokens.colors.rolePrompt.var};
    font-weight: 400;
  }

  ${StyledTerminalLink}:hover &::before,
  ${StyledTerminalLink}:focus-visible &::before,
  ${StyledTerminalLink}:hover &::after,
  ${StyledTerminalLink}:focus-visible &::after {
    color: ${Tokens.colors.surfaceBase.var};
  }
`

const StyledDescription = styled('span')`
  font-family: ${Tokens.fonts.body.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.roleBody.var};

  ${StyledTerminalLink}:hover &,
  ${StyledTerminalLink}:focus-visible & {
    color: ${Tokens.colors.surfaceBase.var};
  }
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
