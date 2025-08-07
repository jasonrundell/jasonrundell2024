'use client'

import * as React from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledLabel = styled('label')`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: ${Tokens.colors.textPrimary.value};
  margin-bottom: 0.25rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  user-select: none;
  opacity: 1;
  &.disabled,
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>((props, ref) => <StyledLabel ref={ref} {...props} />)
Label.displayName = 'Label'
