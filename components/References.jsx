import PropTypes from 'prop-types'
import { Blockquote, Paragraph, Strong } from '@jasonrundell/dropship'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          data: {},
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          data: {},
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Strong>{text}</Strong>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
  },
}

const References = ({ references }) => (
  <ul className="list--references">
    {references.map((reference) => {
      const { id, citeName, company } = reference
      const quote = reference.quote.json
      return (
        <li key={id} className="item--references">
          <Blockquote>{documentToReactComponents(quote, options)}</Blockquote>
          <cite className="cite">
            - {citeName} ({company})
          </cite>
        </li>
      )
    })}
  </ul>
)

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
