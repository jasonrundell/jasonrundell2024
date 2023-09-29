import PropTypes from 'prop-types'
import { Box, Grid, Heading, Row } from '@jasonrundell/dropship'
import { onlyUnique } from '../lib/onlyUnique'

const Skills = ({ items }) => {
  let categories = []

  // build array of categories
  items.forEach((category) => {
    categories.push(category.category)
  })

  // I only want the unique categories
  const uniqueCategories = categories.filter(onlyUnique)

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
              <div key={index} className="list">
                <Heading level={2} label={parentCategory} />
                <ul className="list">
                  {items.map((item) => {
                    const { id, name, category } = item

                    if (parentCategory === category) {
                      return (
                        <li key={id} className="item">
                          <Box isTight>
                            <span className="item-text">{name}</span>
                          </Box>
                        </li>
                      )
                    } else {
                      return null
                    }
                  })}
                </ul>
              </div>
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
