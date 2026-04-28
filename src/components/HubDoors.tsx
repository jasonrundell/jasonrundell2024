import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

export type HubDoor = {
  href: string
  label: string
  description: string
}

interface HubDoorsProps {
  doors: ReadonlyArray<HubDoor>
  ariaLabel?: string
}

const StyledDoorsGrid = styled('nav')`
  display: grid;
  gap: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const StyledDoorList = styled('ul')`
  display: contents;
  list-style: none;
  margin: 0;
  padding: 0;
`

const StyledDoorItem = styled('li')`
  margin: 0;
  padding: 0;
`

const StyledDoor = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  padding: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  border: 1px solid ${Tokens.colors.surfaceDeepest.var};
  background: ${Tokens.colors.surfaceElevated.var};
  color: ${Tokens.colors.roleHeading.var};
  text-decoration: none;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius
      .medium.unit};
  transition: border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    border-color: ${Tokens.colors.rolePrompt.var};
  }
`

const StyledDoorLabel = styled('span')`
  font-weight: 700;
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
`

const StyledDoorDescription = styled('span')`
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.roleBody.var};
`

/**
 * Hub doors — a small navigation grid of CTA cards that sends visitors to the
 * site's main sub-pages. Phase 4 will restyle these as terminal-style buttons;
 * keeping the markup behind a single component preserves a stable interface.
 */
export default function HubDoors({
  doors,
  ariaLabel = 'Site sections',
}: HubDoorsProps) {
  return (
    <StyledDoorsGrid aria-label={ariaLabel}>
      <StyledDoorList>
        {doors.map((door) => (
          <StyledDoorItem key={door.href}>
            <StyledDoor href={door.href}>
              <StyledDoorLabel>{door.label}</StyledDoorLabel>
              <StyledDoorDescription>{door.description}</StyledDoorDescription>
            </StyledDoor>
          </StyledDoorItem>
        ))}
      </StyledDoorList>
    </StyledDoorsGrid>
  )
}
