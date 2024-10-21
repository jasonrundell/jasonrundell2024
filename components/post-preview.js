import Link from 'next/link'
import { Spacer, Paragraph, Row } from '@jasonrundell/dropship'

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
      <Row>
        <Link href={`/posts/${slug}`}>{title}</Link>
      </Row>
      <Spacer sizeLarge="largest" />
      <Row className="mb-5">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </Row>
      <Spacer sizeLarge="largest" />
      <Row>
        <DateComponent dateString={date} />
      </Row>
      <Row>
        <Paragraph>{excerpt}</Paragraph>
      </Row>
    </div>
  )
}
