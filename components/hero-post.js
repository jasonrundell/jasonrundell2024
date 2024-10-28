import Link from 'next/link'
import { Container, Section, Row, Paragraph } from '@jasonrundell/dropship'
import DateComponent from '../components/date'
import PreviewImage from '../components/preview-image'

export default function HeroPost({
  title,
  featuredImage,
  date,
  excerpt,
  slug,
}) {
  return (
    <Container>
      <Section id="hero-post">
        <div className="mb-8 md:mb-16">
          <PreviewImage title={title} slug={slug} url={featuredImage.url} />
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
    </Container>
  )
}
