'use client'
import { Github, Mail } from 'lucide-react'
import { styled } from '@pigment-css/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Tokens from '@/lib/tokens'

const supabase = createClientComponentClient()

const SocialAuthContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: Tokens.sizes.spacing.large.value + Tokens.sizes.spacing.large.unit,
})

const Divider = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'uppercase',
  fontSize: Tokens.fontSizes.sm.value + Tokens.fontSizes.sm.unit,
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: Tokens.colors.border.value,
  },
  '& > span': {
    padding: `0 ${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit}`,
    backgroundColor: Tokens.colors.background.value,
    color: Tokens.colors.textSecondary.value,
  },
})

const ButtonsContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: Tokens.sizes.spacing.medium.value + Tokens.sizes.spacing.medium.unit,
})

interface SocialButtonProps {
  variant?: 'google' | 'github';
}

const StyledSocialButton = styled('button')<SocialButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit};
  width: 100%;
  padding: ${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  font-size: ${Tokens.fontSizes.base.value}${Tokens.fontSizes.base.unit};
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background: ${Tokens.colors.backgroundDarker.value};
  color: ${Tokens.colors.textPrimary.value};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  ${(props: SocialButtonProps) =>
    props.variant === 'google' &&
    `
      background: linear-gradient(135deg, #4285F4, #4285F455);
      color: white;
    `}

  ${(props: SocialButtonProps) =>
    props.variant === 'github' &&
    `
      background: linear-gradient(135deg, #24292e, #24292e55);
      color: white;
    `}
`

const ButtonContent = styled('span')({
  display: 'flex',
  alignItems: 'center',
  gap: Tokens.sizes.spacing.small.value + Tokens.sizes.spacing.small.unit,
})

const ButtonIcon = styled('div')({
  display: 'flex',
  '& > svg': {
    width: '1.25rem',
    height: '1.25rem',
  },
})

interface SocialAuthProps {
  onGoogleSignIn: () => void
  onGithubSignIn: () => void
}

export function SocialAuth({ onGoogleSignIn }: SocialAuthProps) {
  const handleGithubSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('GitHub sign in error:', error)
        throw error
      }
      
      // The redirect will be handled by Supabase
    } catch (error) {
      console.error('GitHub sign in error:', error)
      alert('Failed to start GitHub sign in. Please check the console for more details and try again.')
    }
  }

  return (
    <SocialAuthContainer>
      <Divider>
        <span>Or continue with</span>
      </Divider>
      <ButtonsContainer>
        <StyledSocialButton variant="google" onClick={onGoogleSignIn}>
          <ButtonContent>
            <ButtonIcon>
              <Mail />
            </ButtonIcon>
            <span>Continue with Google</span>
          </ButtonContent>
        </StyledSocialButton>
        <StyledSocialButton variant="github" onClick={handleGithubSignIn}>
          <ButtonContent>
            <ButtonIcon>
              <Github />
            </ButtonIcon>
            <span>Continue with GitHub</span>
          </ButtonContent>
        </StyledSocialButton>
      </ButtonsContainer>
    </SocialAuthContainer>
  )
}
