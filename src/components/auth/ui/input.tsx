import * as React from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const StyledInput = styled('input')`
  box-sizing: border-box;
  width: 100%;
  height: 2.5rem;
  padding: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall
      .unit} ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background: ${Tokens.colors.background.value}D9;
  color: ${Tokens.colors.roleBody.var};
  border: 1px solid ${Tokens.colors.textPrimary.value}1F;
  font-size: 1rem;
  font-weight: 500;
  transition: box-shadow 0.15s, border-color 0.15s;
  box-shadow: ${Tokens.shadows.small.value} 0 ${Tokens.colors.surface.value}08;

  &::placeholder {
    color: ${Tokens.colors.roleBody.var};
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border-color: ${Tokens.colors.rolePrompt.var};
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 20%, transparent);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <StyledInput ref={ref} {...props} />
})
Input.displayName = 'Input'

export { Input }
