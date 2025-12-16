'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root)`
  height: 1.25rem;
  width: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
  border: 1.5px solid ${Tokens.colors.primary.value};
  background: ${Tokens.colors.backgroundDark.value};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: pointer;
  box-sizing: border-box;
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}55;
    border-color: ${Tokens.colors.primary.value};
  }
  &[data-state='checked'] {
    background: ${Tokens.colors.primary.value};
    color: ${Tokens.colors.background.value};
    border-color: ${Tokens.colors.primary.value};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Tokens.colors.background.value};
  width: 100%;
  height: 100%;
`

const StyledCheckIcon = styled(Check)`
  width: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  height: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ ...props }, ref) => (
  <StyledCheckboxRoot ref={ref} {...props}>
    <StyledCheckboxIndicator>
      <StyledCheckIcon />
    </StyledCheckboxIndicator>
  </StyledCheckboxRoot>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
