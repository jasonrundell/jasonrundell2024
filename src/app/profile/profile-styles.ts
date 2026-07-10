import { styled } from '@pigment-css/react'
import { Label } from '@/components/auth/ui/label'
import Tokens from '@/lib/tokens'

export const ProfileContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`

export const UserInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${Tokens.colors.primary.value}15,
    ${Tokens.colors.primary.value}05
  );
  border-radius: 1rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
`

export const UserAvatar = styled('div')`
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  background: ${Tokens.colors.rolePrompt.var};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 4px solid ${Tokens.colors.surfaceSecondary.var};
  box-shadow: 0 4px 20px ${Tokens.colors.primary.value}4D;
`

export const UserName = styled('h2')`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.roleBody.var};
`

export const UserEmail = styled('p')`
  font-size: 1rem;
  margin: 0;
  color: ${Tokens.colors.textSecondary.var};
  opacity: 0.8;
`

export const AccountInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const SectionTitle = styled('h3')`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.roleBody.var};
  text-align: center;
`

export const InfoGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

export const InfoCard = styled('div')`
  background: ${Tokens.colors.surfaceSecondary.var};
  border-radius: 0;
  padding: 1.25rem;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.accent.var};
  }
`

export const InfoCardHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${Tokens.colors.rolePrompt.var};
`

export const InfoValue = styled('div')`
  font-size: 1rem;
  font-weight: 500;
  color: ${Tokens.colors.roleBody.var};
  padding: 0.5rem 0;
`

export const StyledInfoLabel = styled(Label)`
  color: ${Tokens.colors.rolePrompt.var} !important;
  margin: 0 !important;
`

export const StyledInfoValueCapitalize = styled(InfoValue)`
  text-transform: capitalize;
`

export const ProfileForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${Tokens.colors.surfaceSecondary.var};
  border-radius: 0;
  padding: 1.5rem;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
`

export const FormRow = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const PasswordInputWrapper = styled('div')`
  position: relative;
`

export const PasswordToggleButton = styled('button')`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${Tokens.colors.textSecondary.var};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${Tokens.colors.rolePrompt.var};
  }
`

export const ButtonGroup = styled('div')`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

export const CancelButton = styled('button')`
  background: none;
  border: 1px solid ${Tokens.colors.textSecondary.var};
  color: ${Tokens.colors.textSecondary.var};
  padding: 0.75rem 1.5rem;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.roleBody.var};
    color: ${Tokens.colors.roleBody.var};
  }
`

export const PasswordMatchIndicator = styled('div')`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const InfoBox = styled('div')`
  background: ${Tokens.colors.primary.value}10;
  border: 1px solid ${Tokens.colors.primary.value}30;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  padding: 1rem;
  margin-bottom: 1rem;
`

export const InfoBoxTitle = styled('h4')`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${Tokens.colors.rolePrompt.var};
`

export const InfoBoxText = styled('p')`
  font-size: 0.875rem;
  margin: 0;
  color: ${Tokens.colors.textSecondary.var};
  line-height: 1.4;
`
