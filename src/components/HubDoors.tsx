import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'
import { TerminalButtonLink } from '@/components/chrome'

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

/**
 * Hub doors — the primary 3-door navigation grid on `/`. Phase 4 swaps the
 * card style for terminal-button chrome via `TerminalButtonLink` so the
 * visual language matches the rest of the refined-terminal aesthetic.
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
            <TerminalButtonLink
              href={door.href}
              label={door.label}
              description={door.description}
            />
          </StyledDoorItem>
        ))}
      </StyledDoorList>
    </StyledDoorsGrid>
  )
}
