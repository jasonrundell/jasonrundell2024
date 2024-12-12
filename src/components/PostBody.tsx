import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { Row } from '@jasonrundell/dropship'
import RichTextAsset from './RichTextAsset'

export interface PostBodyProps {
  content: {
    json: any
    links: {
      assets: {
        block: {
          sys: {
            id: string
          }
        }[]
      }
    }
  }
}

const customMarkdownOptions = (content: PostBodyProps) => ({
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

export default function PostBody({ content }: PostBodyProps) {
  return (
    <section>
      <Row>
        {documentToReactComponents(
          content.json,
          customMarkdownOptions(content)
        )}
      </Row>
    </section>
  )
}