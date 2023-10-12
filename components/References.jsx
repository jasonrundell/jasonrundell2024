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
  const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: ${tokens['--size-normal']};
    padding: 0;
    list-style: none;
  `

  const StyledListItem = styled.li`
    margin-bottom: ${tokens['--size-large']};
  `

  const StyledCite = styled.cite`
    color: ${tokens['--primary-color']};
  `

  return (
    <StyledList>
      {references.map((reference) => {
        const { id, citeName, company } = reference
        const quote = reference.quote.json
        return (
          <StyledListItem key={id}>
            <Blockquote>{documentToReactComponents(quote, options)}</Blockquote>
            <StyledCite>
              - {citeName} ({company})
            </StyledCite>
          </StyledListItem>
        )
      })}
    </StyledList>
  )
}

References.propTypes = {
  references: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      quote: PropTypes.shape({ raw: PropTypes.string }).isRequired,
      citeName: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default References
