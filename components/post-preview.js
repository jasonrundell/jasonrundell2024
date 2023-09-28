import Link from 'next/link'
import { Paragraph, Row } from '@jasonrundell/dropship'
import DateComponent from '../components/date'
import CoverImage from './cover-image'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  slug,
}) {
  return (
    <div>
      <Row className="mb-5">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </Row>
      <Row>
        <Link href={`/posts/${slug}`}>{title}</Link>
      </Row>
      <Row>
        <DateComponent dateString={date} />
      </Row>
      <Row>
        <Paragraph>{excerpt}</Paragraph>
      </Row>
    </div>
  )
}
