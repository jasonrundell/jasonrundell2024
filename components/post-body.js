import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { Section, Row } from '@jasonrundell/dropship'
import RichTextAsset from './rich-text-asset'

const customMarkdownOptions = (content) => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <RichTextAsset
        id={node.data.target.sys.id}
        assets={content.links.assets.block}
      />
    ),
  },
  renderMark: {
    [MARKS.CODE]: (embedded) => (
      <div dangerouslySetInnerHTML={{ __html: embedded }} />
    ),
  },
})

export default function PostBody({ content }) {
  return (
    <Section>
      <Row>
        {documentToReactComponents(
          content.json,
          customMarkdownOptions(content)
        )}
      </Row>
    </Section>
  )
}
