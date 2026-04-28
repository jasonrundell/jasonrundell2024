import * as React from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const StyledBadge = styled('div')`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border-width: 1.5px;
  border-style: solid;
  padding: 0.125rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  /* Default */
  &.variant-default {
    border-color: transparent;
    background: ${Tokens.colors.rolePrompt.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
  &.variant-default:hover {
    background: color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 80%, transparent);
  }
  /* Secondary */
  &.variant-secondary {
    border-color: transparent;
    background: ${Tokens.colors.roleHeading.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
  &.variant-secondary:hover {
    background: ${Tokens.colors.secondaryVariant.var};
  }
  /* Destructive */
  &.variant-destructive {
    border-color: transparent;
    background: ${Tokens.colors.roleDanger.var};
    color: #fff;
  }
  &.variant-destructive:hover {
    background: color-mix(in srgb, ${Tokens.colors.roleDanger.var} 80%, transparent);
  }
  /* Outline */
  &.variant-outline {
    border-color: ${Tokens.colors.roleBody.var};
    background: transparent;
    color: ${Tokens.colors.roleBody.var};
  }
`

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantClass = `variant-${variant}`
  return (
    <StyledBadge
      className={[variantClass, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
