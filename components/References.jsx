import PropTypes from 'prop-types'
import { useState } from 'react'
import { Blockquote, Paragraph, Strong, Button } from '@jasonrundell/dropship'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import styled from '@emotion/styled'
import { tokens } from '../data/tokens'

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Strong>{text}</Strong>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
  },
}

const StyledCarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
`

const StyledReference = styled.div`
  margin-bottom: ${tokens['--size-xlarge']};
  padding-left: ${tokens['--size-xlarge']};
  padding-right: ${tokens['--size-xlarge']};
`

const StyledCite = styled.cite`
  color: ${tokens['--primary-color']};
`

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${tokens['--size-normal']};
  margin-left: ${tokens['--size-normal']};
  margin-right: ${tokens['--size-normal']};
`

const References = ({ references }) => {
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0)

  const handleNext = () => {
    setCurrentReferenceIndex((prevIndex) =>
      prevIndex === references.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrev = () => {
    setCurrentReferenceIndex((prevIndex) =>
      prevIndex === 0 ? references.length - 1 : prevIndex - 1
    )
  }

  const currentReference = references[currentReferenceIndex]
  const { citeName, company, quote } = currentReference || {}

  // Additional defensive checks for quote and its structure
  const renderQuote =
    quote && quote.json
      ? documentToReactComponents(quote.json, options) // Make sure you access quote.json directly
      : 'No quote available.'

  return (
    <StyledCarouselContainer>
      <StyledReference>
        <Blockquote>{renderQuote}</Blockquote>
        <StyledCite>
          - {citeName || 'Unknown'} ({company || 'Unknown'})
        </StyledCite>
      </StyledReference>

      <NavigationContainer>
        <Button onClick={handlePrev} label="Previous" />
        <Button onClick={handleNext} label="Next" />
      </NavigationContainer>
    </StyledCarouselContainer>
  )
}

References.propTypes = {
  references: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      quote: PropTypes.shape({
        json: PropTypes.object,
      }).isRequired,
      citeName: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default References
