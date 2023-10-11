import PropTypes from 'prop-types'

import { Heading } from '@jasonrundell/dropship'

// import {
//   list,
//   item,
//   company as companyStyle,
//   startDate as startDateStyle,
//   endDate as endDateStyle,
// } from './Positions.module.scss'

const Positions = ({ positions }) => {
  return (
    <ul className="list--positions">
      {positions.map((position) => {
        const { id, role, company, startDate, endDate } = position
        return (
          <li key={id} className="item--positions">
            <Heading level={2} label={role} />
            <span className="company">{company}</span>
            <br />
            <span className="start-date">{startDate}</span> -{' '}
            <span className="end-date">{endDate}</span>
          </li>
        )
      })}
    </ul>
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
