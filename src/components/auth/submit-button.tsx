'use client'

import { Button } from '@/components/auth/ui/button'
import { type ComponentProps, useState } from 'react'

type Props = ComponentProps<typeof Button> & {
  pendingText?: string
}

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  disabled,
  onClick,
  ...props
}: Props) {
  const [isPending, setIsPending] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    const form = event.currentTarget.form
    // Only lock the button when a real submit is about to proceed.
    // Native HTML validation can block submit after click — don't stay disabled.
    if (!form || !form.checkValidity()) return

    setIsPending(true)
  }

  return (
    <Button
      type="submit"
      disabled={disabled || isPending}
      aria-busy={isPending}
      onClick={handleClick}
      {...props}
    >
      {isPending ? pendingText : children}
    </Button>
  )
}
