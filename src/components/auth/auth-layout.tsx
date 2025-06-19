import { ReactNode } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledAuthContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit};
  background: linear-gradient(
    135deg,
    ${Tokens.colors.background.value} 0%,
    ${Tokens.colors.backgroundDark.value} 100%
  );
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
  padding: 3rem 2.5rem;
  background-color: ${Tokens.colors.backgroundDarker.value};
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  }
`

const StyledAuthHeader = styled('div')`
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const StyledAuthTitle = styled('h1')`
  color: ${Tokens.colors.primary.value};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
  background: linear-gradient(
    135deg,
    ${Tokens.colors.primary.value},
    ${Tokens.colors.primary.value}77
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const StyledAuthSubtitle = styled('p')`
  color: ${Tokens.colors.textPrimary.value};
  font-size: 1.15rem;
  margin-bottom: 0;
  opacity: 0.9;
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
