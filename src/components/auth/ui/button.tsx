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
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  opacity: 1;
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
    padding: 0 1rem;
    font-size: 0.95rem;
  }
  &.size-lg {
    height: 2.75rem;
    padding: 0 2rem;
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
    background: ${Tokens.colors.primary.value};
    color: ${Tokens.colors.background.value};
  }
  &.variant-default:hover {
    background: ${Tokens.colors.primary.value}CC;
  }
  &.variant-default:focus-visible {
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}99;
  }
  &.variant-destructive {
    background: #e3342f;
    color: #fff;
  }
  &.variant-destructive:hover {
    background: #cc1f1a;
  }
  &.variant-destructive:focus-visible {
    box-shadow: 0 0 0 2px #e3342f99;
  }
  &.variant-outline {
    background: transparent;
    color: ${Tokens.colors.primary.value};
    border: 1.5px solid ${Tokens.colors.primary.value};
  }
  &.variant-outline:hover {
    background: ${Tokens.colors.backgroundDark.value};
  }
  &.variant-outline:focus-visible {
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}99;
  }
  &.variant-secondary {
    background: ${Tokens.colors.secondary.value};
    color: ${Tokens.colors.background.value};
  }
  &.variant-secondary:hover {
    background: ${Tokens.colors.secondaryVariant.value};
  }
  &.variant-secondary:focus-visible {
    box-shadow: 0 0 0 2px ${Tokens.colors.secondary.value}99;
  }
  &.variant-ghost {
    background: transparent;
    color: ${Tokens.colors.primary.value};
  }
  &.variant-ghost:hover {
    background: ${Tokens.colors.backgroundDark.value};
  }
  &.variant-ghost:focus-visible {
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}99;
  }
  &.variant-link {
    background: none;
    color: ${Tokens.colors.primary.value};
    text-decoration: underline;
  }
  &.variant-link:hover {
    color: ${Tokens.colors.primaryVariant.value};
  }
  &.variant-link:focus-visible {
    box-shadow: 0 0 0 2px ${Tokens.colors.primary.value}99;
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
