import { ReactNode } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledAuthContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 3rem 1.5rem 4rem;
  background-color: ${Tokens.colors.surfacePrimary.var};
`

const StyledAuthCard = styled('div')`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background-color: ${Tokens.colors.surfaceSecondary.var};
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const StyledAuthHeader = styled('div')`
  text-align: left;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};
`

const StyledEyebrow = styled('span')`
  display: block;
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${Tokens.colors.accent.var};
  margin-bottom: 0.75rem;
`

const StyledAuthTitle = styled('h1')`
  font-family: ${Tokens.fonts.heading.var};
  color: ${Tokens.colors.ink.var};
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
  line-height: 1.15;
`

const StyledAuthSubtitle = styled('p')`
  color: ${Tokens.colors.inkMuted.var};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <StyledAuthContainer>
      <StyledAuthCard>
        <StyledAuthHeader>
          <StyledEyebrow>Account</StyledEyebrow>
          <StyledAuthTitle>{title}</StyledAuthTitle>
          <StyledAuthSubtitle>{subtitle}</StyledAuthSubtitle>
        </StyledAuthHeader>
        {children}
      </StyledAuthCard>
    </StyledAuthContainer>
  )
}
