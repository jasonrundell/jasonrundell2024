import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Heading } from '@jasonrundell/dropship'

import { tokens } from '../data/tokens'

const Positions = ({ positions }) => {
  const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
  `

  const StyledListItem = styled.li`
    margin-bottom: ${tokens['--size-large']};
  `

  const StyledCompany = styled.span`
    font-style: italic;
  `

  const StyledDate = styled.span`
    font-size: ${tokens['--size-small']};
  `

  return (
    <StyledList>
      {positions.map((position) => {
        const { id, role, company, startDate, endDate } = position
        return (
          <StyledListItem key={id}>
            <Heading level={3} label={role} />
            <StyledCompany>{company}</StyledCompany>
            <br />
            <StyledDate>{startDate}</StyledDate> -{' '}
            <StyledDate>{endDate}</StyledDate>
          </StyledListItem>
        )
      })}
    </StyledList>
  )
}

Positions.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Positions
