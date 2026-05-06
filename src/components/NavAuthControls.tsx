'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/auth/ui/button'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledAuthButtonGroup = styled('div')`
  display: none;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  margin-left: auto;
  align-items: center;
  padding-right: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}) {
    display: flex;
    padding-right: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  }
`

interface NavAuthControlsProps {
  user: User | null
}

export default function NavAuthControls({ user }: NavAuthControlsProps) {
  return (
    <StyledAuthButtonGroup>
      {user ? (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">Profile</Link>
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="default" size="sm">
              Log out
            </Button>
          </form>
        </>
      ) : (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </>
      )}
    </StyledAuthButtonGroup>
  )
}
