import { ReactNode } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledAuthContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.large.unit};
  background-color: ${Tokens.colors.background.value};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
`

const StyledAuthCard = styled('div')`
  width: 100%;
  max-width: 420px;
  padding: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge
      .unit} 2.5rem;
  background-color: ${Tokens.colors.backgroundDarker.value};
  border-radius: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  box-shadow: ${Tokens.shadows.large.value} ${Tokens.colors.surface.value}33,
    0 4px 8px ${Tokens.colors.surface.value}1A;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`

const StyledAuthHeader = styled('div')`
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  border-bottom: 1px solid ${Tokens.colors.secondary.value}1A;
`

const StyledAuthTitle = styled('h1')`
  color: ${Tokens.colors.primary.value};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  letter-spacing: -0.02em;
  line-height: 1.2;
  background-color: ${Tokens.colors.primary.value};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${Tokens.shadows.text.value} ${Tokens.colors.surface.value}1A;
`

const StyledAuthSubtitle = styled('p')`
  color: ${Tokens.colors.textPrimary.value};
  font-size: 1.15rem;
  margin-bottom: 0;
  opacity: ${Tokens.opacity.higher.value};
  transition: opacity 0.3s ease;

  ${StyledAuthCard}:hover & {
    opacity: 1;
  }
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
          <StyledAuthTitle>{title}</StyledAuthTitle>
          <StyledAuthSubtitle>{subtitle}</StyledAuthSubtitle>
        </StyledAuthHeader>
        {children}
      </StyledAuthCard>
    </StyledAuthContainer>
  )
}
