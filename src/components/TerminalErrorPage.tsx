'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledShell = styled('main')`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit}
    ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  background-color: ${Tokens.colors.surfaceBase.var};
  color: ${Tokens.colors.roleBody.var};
`

const StyledPanel = styled('section')`
  width: 100%;
  max-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes.breakpoints
      .medium.unit};
  margin: 0 auto;
  padding: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  border: 1px solid ${Tokens.colors.roleDanger.var};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium
      .unit};
  background-color: ${Tokens.colors.surfaceElevated.var};
  box-shadow: 0 1rem 3rem ${Tokens.colors.surfaceDeepest.value}66;
`

const StyledComment = styled('p')`
  margin: 0 0 ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit};
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.roleInfo.var};
`

const StyledCommand = styled('p')`
  margin: 0 0 ${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit};
  font-family: ${Tokens.fonts.monospace.family};
  color: ${Tokens.colors.roleDanger.var};
`

const StyledPrompt = styled('span')`
  color: ${Tokens.colors.rolePrompt.var};
`

const StyledPath = styled('code')`
  color: ${Tokens.colors.roleInfo.var};
`

const StyledHeading = styled('h1')`
  margin: 0 0 ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit};
  color: ${Tokens.colors.roleHeading.var};
  font-size: clamp(2rem, 7vw, 4rem);
  line-height: 1;
`

const StyledBody = styled('p')`
  margin: 0 0 ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  max-width: 38rem;
  line-height: 1.6;
`

const StyledActions = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit};
`

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  border: 1px solid ${Tokens.colors.rolePrompt.var};
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
  background-color: transparent;
  color: ${Tokens.colors.rolePrompt.var};
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Tokens.colors.rolePrompt.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
`

const StyledHomeLink = styled(Link)`
  ${actionStyles}
`

const StyledResetButton = styled('button')`
  ${actionStyles}
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
        <StyledComment>{`// ${comment}`}</StyledComment>
        <StyledCommand>
          <StyledPrompt>$</StyledPrompt> command not found:{' '}
          <StyledPath>{pathname}</StyledPath>
        </StyledCommand>
        <StyledHeading id="terminal-error-heading">
          {statusCode}: {title}
        </StyledHeading>
        <StyledBody>{message}</StyledBody>
        <StyledActions>
          <StyledHomeLink href="/">cd /home</StyledHomeLink>
          {reset && (
            <StyledResetButton type="button" onClick={reset}>
              retry command
            </StyledResetButton>
          )}
        </StyledActions>
      </StyledPanel>
    </StyledShell>
  )
}
