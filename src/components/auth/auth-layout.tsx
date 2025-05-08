import { ReactNode } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledAuthContainer = styled('div')`
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit};
  background: linear-gradient(
    180deg,
    ${Tokens.colors.background.value} 0%,
    ${Tokens.colors.backgroundDark.value} 100%
  );
`

const StyledAuthCard = styled('div')`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem 2rem 2rem;
  background-color: ${Tokens.colors.backgroundDarker.value};
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25), 0 1.5px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const StyledAuthHeader = styled('div')`
  text-align: center;
  margin-bottom: 2.5rem;
`

const StyledAuthTitle = styled('h1')`
  color: ${Tokens.colors.primary.value};
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`

const StyledAuthSubtitle = styled('p')`
  color: ${Tokens.colors.textPrimary.value};
  font-size: 1.1rem;
  margin-bottom: 0;
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
