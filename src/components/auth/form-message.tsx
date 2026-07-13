import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export type Message =
  | { success: string }
  | { error: string }
  | { message: string }

const MessageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 28rem;
  font-size: 0.875rem;
`

const SuccessMessage = styled('div')`
  color: ${Tokens.colors.roleSuccess.var};
  border-left: 2px solid ${Tokens.colors.roleSuccess.var};
  padding: 0.5rem 1rem;
`

const ErrorMessage = styled('div')`
  color: ${Tokens.colors.roleDanger.var};
  border-left: 2px solid ${Tokens.colors.roleDanger.var};
  padding: 0.5rem 1rem;
`

const InfoMessage = styled('div')`
  color: ${Tokens.colors.ink.var};
  border-left: 2px solid ${Tokens.colors.line.var};
  padding: 0.5rem 1rem;
`

export function FormMessage({ message }: { message: Message }) {
  return (
    <MessageContainer>
      {'success' in message && (
        <SuccessMessage role="status">{message.success}</SuccessMessage>
      )}
      {'error' in message && (
        <ErrorMessage role="alert">{message.error}</ErrorMessage>
      )}
      {'message' in message && (
        <InfoMessage role="status">{message.message}</InfoMessage>
      )}
    </MessageContainer>
  )
}
