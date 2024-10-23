import PropTypes from 'prop-types'
import { Blockquote, Paragraph, Strong } from '@jasonrundell/dropship'
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

const References = ({ references }) => {
  const StyledReference = styled.div`
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  `

  const StyledReferenceEmphasis = styled.div`
    font-size: 1.5rem;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  `

  const StyledCite = styled.cite`
    color: ${tokens['--secondary-color']};
  `

  return (
    references.length > 0 &&
    references.map((reference, index) => {
      const { citeName, company, quote, emphasis } = reference || {}

      // Additional defensive checks for quote and its structure
      const renderQuote =
        quote && quote.json
          ? documentToReactComponents(quote.json, options) // Make sure you access quote.json directly
          : 'No quote available.'
      return (
        <StyledReference key={index}>
          {emphasis ? (
            <StyledReferenceEmphasis>
              <Blockquote>{renderQuote}</Blockquote>
            </StyledReferenceEmphasis>
          ) : (
            <Blockquote>{renderQuote}</Blockquote>
          )}
          <StyledCite>
            - {citeName || 'Unknown'} ({company || 'Unknown'})
          </StyledCite>
        </StyledReference>
      )
    })
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
      order: PropTypes.number,
      emphasis: PropTypes.bool,
    })
  ).isRequired,
}

export default References
