import * as React from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const StyledInput = styled('input')`
  box-sizing: border-box;
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: rgba(36, 47, 62, 0.85);
  color: ${Tokens.colors.textPrimary.value};
  border: 1px solid rgba(154, 174, 198, 0.12);
  font-size: 1rem;
  font-weight: 500;
  transition: box-shadow 0.15s, border-color 0.15s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);

  &::placeholder {
    color: ${Tokens.colors.textPrimary.value};
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border-color: ${Tokens.colors.primary.value};
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}33;
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
