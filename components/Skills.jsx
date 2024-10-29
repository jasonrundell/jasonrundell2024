import PropTypes from 'prop-types'
import { Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import { onlyUnique } from '../lib/onlyUnique'
import { tokens } from '../data/tokens'

const Skills = ({ items }) => {
  let categories = []

  // Build array of categories
  items.forEach((category) => {
    categories.push(category.category)
  })

  // I only want the unique categories
  const uniqueCategories = categories.filter(onlyUnique)

  const StyledListContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 0;
    margin-bottom: ${tokens['--size-normal']};
    list-style: none;
    padding-left: 0;
    width: 100%;
  `

  const StyledList = styled.ul`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 0;
    list-style: none;
    padding-left: 0;
  `

  const StyledListItem = styled.li`
    display: inline;
    margin-right: ${tokens['--size-small']};
    margin-left: 0;
    color: ${tokens['--text-color']};
    margin: 0 ${tokens['--size-small']} 0 0;
    line-height: 1.6;
  `

  const StyledHeading = styled.h3`
    font-size: ${tokens['--size-normal']};
    margin: 0;
  `

  return (
    <Row>
      {uniqueCategories.map((parentCategory, index) => {
        return (
          <StyledListContainer key={index}>
            <StyledHeading>{parentCategory}</StyledHeading>
            <StyledList>
              {items
                .filter((item) => item.category === parentCategory)
                .map((item) => (
                  <StyledListItem key={item.id}>{item.name}</StyledListItem>
                ))}
            </StyledList>
          </StyledListContainer>
        )
      })}
    </Row>
  )
}

Skills.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Skills
