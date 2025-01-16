import { styled } from '@pigment-css/react'

import { Position, Positions as PositionsDef } from '@/typeDefinitions/app'
import Tokens from '@/lib/tokens'

const StyledList = styled('ul')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
`

const StyledListItem = styled('li')`
  margin: 0 0 ${Tokens.sizes.large}rem 0;
`

const StyledCompany = styled('span')`
  font-style: normal;
`

export default async function Positions({ positions }: PositionsDef) {
  const uniquePositions = positions.filter(
    (position, index, self) =>
      index === self.findIndex((p) => p.company === position.company)
  )

  return (
    <StyledList>
      {uniquePositions.map((position: Position, index: number) => {
        const { company } = position
        return (
          <StyledListItem key={index}>
            {/* <Heading level={3} label={role} /> */}
            <StyledCompany>{company}</StyledCompany>
            {/* <br /> */}
            {/* <StyledDate>{startDate}</StyledDate> -{' '} */}
            {/* <StyledDate>{endDate}</StyledDate> */}
          </StyledListItem>
        )
      })}
    </StyledList>
  )
}
