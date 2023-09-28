import Link from 'next/link'
import { Section, Row, Paragraph } from '@jasonrundell/dropship'
import DateComponent from '../components/date'
import CoverImage from '../components/cover-image'

export default function HeroPost({ title, coverImage, date, excerpt, slug }) {
  return (
    <Section id="hero-post">
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <Row>
          <Link href={`/posts/${slug}`}>{title}</Link>
          <div className="mb-4 md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </Row>
        <Row>
          <Paragraph>{excerpt}</Paragraph>
        </Row>
      </div>
    </Section>
  )
}
