'use client'

import * as React from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledLabel = styled('label')`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: ${Tokens.colors.textPrimary.value};
  margin-bottom: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
  letter-spacing: 0.01em;
  cursor: pointer;
  user-select: none;
  opacity: 1;
  &.disabled,
  &:disabled {
    opacity: ${Tokens.opacity.medium.value};
    cursor: not-allowed;
  }
`

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>((props, ref) => <StyledLabel ref={ref} {...props} />)
Label.displayName = 'Label'
