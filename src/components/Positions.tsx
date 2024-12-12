import styled from '@emotion/styled'

import { tokens } from '../data/tokens'

export interface PositionsProps {
  positions: {
    id: string
    role: string
    company: string
    startDate: string
    endDate: string
  }[]
}

const Positions = ({ positions }: PositionsProps) => {
  const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
  `

  const StyledListItem = styled.li`
    margin: 0 0 ${tokens['--size-large']} 0;
  `

  const StyledCompany = styled.span`
    font-style: normal;
  `

  const uniquePositions = positions.filter(
    (position, index, self) =>
      index === self.findIndex((p) => p.company === position.company)
  )

  return (
    <StyledList>
      {uniquePositions.map((position, index) => {
        const { role, company, startDate, endDate } = position
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

export default Positions
