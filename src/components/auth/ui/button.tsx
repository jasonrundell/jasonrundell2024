import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

const StyledButton = styled('button')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
  font-weight: 600;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  opacity: 1;
  text-decoration: none;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  /* Size variants */
  &.size-default {
    height: 2.5rem;
    padding: 0 1.25rem;
    font-size: 1rem;
  }
  &.size-sm {
    height: 2.25rem;
    padding: 0;
    font-size: 0.95rem;
  }
  &.size-lg {
    height: 2.75rem;
    padding: 0 ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
    font-size: 1.1rem;
  }
  &.size-icon {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    font-size: 1.1rem;
  }
  /* Variant styles */
  &.variant-default {
    background: ${Tokens.colors.rolePrompt.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
  &.variant-default:hover {
    background: color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 80%, transparent);
  }
  &.variant-default:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 60%, transparent);
  }
  &.variant-destructive {
    background: ${Tokens.colors.roleDanger.var};
    color: #fff;
  }
  &.variant-destructive:hover {
    background: color-mix(in srgb, ${Tokens.colors.roleDanger.var} 80%, transparent);
  }
  &.variant-destructive:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.roleDanger.var} 60%, transparent);
  }
  &.variant-outline {
    background: transparent;
    color: ${Tokens.colors.rolePrompt.var};
    border: 1.5px solid ${Tokens.colors.rolePrompt.var};
  }
  &.variant-outline:hover {
    background: ${Tokens.colors.surfaceElevated.var};
  }
  &.variant-outline:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 60%, transparent);
  }
  &.variant-secondary {
    background: ${Tokens.colors.roleHeading.var};
    color: ${Tokens.colors.surfaceBase.var};
  }
  &.variant-secondary:hover {
    background: ${Tokens.colors.secondaryVariant.var};
  }
  &.variant-secondary:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.roleHeading.var} 60%, transparent);
  }
  &.variant-ghost {
    background: transparent;
    color: ${Tokens.colors.rolePrompt.var};
  }
  &.variant-ghost:hover {
    background: ${Tokens.colors.surfaceElevated.var};
  }
  &.variant-ghost:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 60%, transparent);
  }
  &.variant-link {
    background: none;
    color: ${Tokens.colors.rolePrompt.var};
    text-decoration: underline;
  }
  &.variant-link:hover {
    color: ${Tokens.colors.primaryVariant.var};
  }
  &.variant-link:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, ${Tokens.colors.rolePrompt.var} 60%, transparent);
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    &.size-sm {
      padding: 0 1rem;
    }
  }
`

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant = 'default',
      size = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const variantClass = `variant-${variant}`
    const sizeClass = `size-${size}`
    return (
      <StyledButton
        as={Comp}
        ref={ref}
        className={[variantClass, sizeClass, className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
