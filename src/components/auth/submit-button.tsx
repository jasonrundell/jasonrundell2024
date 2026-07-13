'use client'

import { Button } from '@/components/auth/ui/button'
import { type ComponentProps, useState } from 'react'

type Props = ComponentProps<typeof Button> & {
  pendingText?: string
}

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  ...props
}: Props) {
  const [isPending, setIsPending] = useState(false)

  const handleClick = () => {
    setIsPending(true)
  }

  return (
    <Button
      type="submit"
      disabled={isPending}
      aria-busy={isPending}
      onClick={handleClick}
      {...props}
    >
      {isPending ? pendingText : children}
    </Button>
  )
}
