'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledShell = styled('main')`
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: 4.5rem 1.25rem;
  background-color: ${Tokens.colors.surfacePrimary.var};
  color: ${Tokens.colors.ink.var};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    padding: 6rem 4rem;
  }
`

const StyledPanel = styled('section')`
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
`

const StyledComment = styled('p')`
  margin: 0 0 1rem;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${Tokens.colors.accent.var};
`

const StyledCommand = styled('p')`
  margin: 0 0 1.5rem;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.875rem;
  color: ${Tokens.colors.inkFaint.var};
`

const StyledPath = styled('code')`
  color: ${Tokens.colors.ink.var};
`

const StyledHeading = styled('h1')`
  margin: 0 0 1rem;
  font-family: ${Tokens.fonts.heading.family};
  color: ${Tokens.colors.ink.var};
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1.1;
`

const StyledBody = styled('p')`
  margin: 0 0 1.75rem;
  max-width: 44ch;
  line-height: 1.6;
  color: ${Tokens.colors.inkMuted.var};
`

const StyledActions = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const StyledHomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 1.375rem;
  background-color: ${Tokens.colors.accent.var};
  border: 1px solid ${Tokens.colors.accent.var};
  color: ${Tokens.colors.onAccent.var};
  font-family: ${Tokens.fonts.body.family};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Tokens.colors.accentSoft.var};
    border-color: ${Tokens.colors.accentSoft.var};
  }
`

const StyledResetButton = styled('button')`
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 1.375rem;
  background-color: transparent;
  border: 1px solid ${Tokens.colors.line.var};
  color: ${Tokens.colors.ink.var};
  font-family: ${Tokens.fonts.body.family};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover,
  &:focus-visible {
    border-color: ${Tokens.colors.accent.var};
    color: ${Tokens.colors.accent.var};
  }
`

interface TerminalErrorPageProps {
  statusCode: '404' | '500'
  title: string
  message: string
  comment: string
  reset?: () => void
}

export default function TerminalErrorPage({
  statusCode,
  title,
  message,
  comment,
  reset,
}: TerminalErrorPageProps) {
  const pathname = usePathname() || '/'

  return (
    <StyledShell aria-labelledby="terminal-error-heading">
      <StyledPanel>
        <StyledComment>{comment}</StyledComment>
        <StyledCommand>
          No page at <StyledPath>{pathname}</StyledPath>
        </StyledCommand>
        <StyledHeading id="terminal-error-heading">
          {statusCode} - {title}
        </StyledHeading>
        <StyledBody>{message}</StyledBody>
        <StyledActions>
          <StyledHomeLink href="/">Back to home</StyledHomeLink>
          {reset && (
            <StyledResetButton type="button" onClick={reset}>
              Try again
            </StyledResetButton>
          )}
        </StyledActions>
      </StyledPanel>
    </StyledShell>
  )
}
