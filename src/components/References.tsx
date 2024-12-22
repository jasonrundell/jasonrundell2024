import { Blockquote } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document } from '@contentful/rich-text-types'
import styled from '@emotion/styled'
import { tokens } from '@/data/tokens'
import { References as ReferencesDef } from '@/typeDefinitions/app'

const options = {
  // renderMark: {
  //   [MARKS.BOLD]: (text) => <strong>{text}</strong>,
  // },
  // renderNode: {
  //   [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
  // },
}

const References = ({ references }: ReferencesDef) => {
  const StyledReference = styled.div`
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  `

  const StyledReferenceEmphasis = styled.div`
    font-size: ${tokens['--size-large']};

    @media (min-width: 48rem) {
      font-size: ${tokens['--size-xlarge']};
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
      const renderQuote = quote
        ? documentToReactComponents(quote as Document, options) // Make sure you access quote.json directly
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

export default References
