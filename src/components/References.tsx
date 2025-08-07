import { Blockquote } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document } from '@contentful/rich-text-types'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { References as ReferencesDef } from '@/typeDefinitions/app'

const options = {
  // renderMark: {
  //   [MARKS.BOLD]: (text) => <strong>{text}</strong>,
  // },
  // renderNode: {
  //   [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
  // },
}

const StyledReference = styled('div')`
  margin-top: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit};
  margin-bottom: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit};
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    font-size: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  }
`

const StyledCite = styled('cite')`
  color: ${Tokens.colors.secondary.value};
`

export default function References({ references }: ReferencesDef) {
  return (
    <>
      {references.length > 0 &&
        references.map((reference, index) => {
          const { citeName, company, quote } = reference || {}

          // Additional defensive checks for quote and its structure
          const renderQuote = quote
            ? documentToReactComponents(quote as Document, options) // Make sure you access quote.json directly
            : 'No quote available.'
          return (
            <StyledReference key={index}>
              <Blockquote>{renderQuote}</Blockquote>
              <StyledCite>
                - {citeName || 'Unknown'} ({company || 'Unknown'})
              </StyledCite>
            </StyledReference>
          )
        })}
    </>
  )
}
