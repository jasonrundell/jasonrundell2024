import PropTypes from 'prop-types'
import { Box, Grid, Heading, Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import { onlyUnique } from '../lib/onlyUnique'
import { tokens } from '../data/tokens'

const Skills = ({ items }) => {
  let categories = []

  // build array of categories
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
  `

  const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    margin-top: 0;
    margin-bottom: ${tokens['--size-normal']};
    list-style: none;
    padding-left: 0;
  `

  const StyledListItem = styled.li`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: ${tokens['--size-smallest']};
  `

  const StyledItemText = styled.span`
    flex: 1;
    font-size: ${tokens['--size-small']};
  `

  return (
    <>
      <Row>
        <Grid
          columnCount={1}
          mediumColumnCount={2}
          largeColumnCount={3}
          breakInside="avoid"
        >
          {uniqueCategories.map((parentCategory, index) => {
            return (
              <StyledListContainer key={index}>
                <Heading level={3} label={parentCategory} />
                <StyledList>
                  {items.map((item) => {
                    const { id, name, category } = item

                    if (parentCategory === category) {
                      return (
                        <StyledListItem key={id}>
                          <Box isTight>
                            <StyledItemText>{name}</StyledItemText>
                          </Box>
                        </StyledListItem>
                      )
                    } else {
                      return null
                    }
                  })}
                </StyledList>
              </StyledListContainer>
            )
          })}
        </Grid>
      </Row>
    </>
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
