import Link from 'next/link'
import { Container, Row } from '@jasonrundell/dropship'
import ContentDate from '../components/ContentDate'
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
      <section id="hero-post">
        <div className="mb-8 md:mb-16">
          <PreviewImage title={title} slug={slug} url={featuredImage.url} />
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
          <Row>
            <Link href={`/posts/${slug}`}>{title}</Link>
            <div className="mb-4 md:mb-0">
              <ContentDate dateString={date} />
            </div>
          </Row>
          <Row>
            <p>{excerpt}</p>
          </Row>
        </div>
      </section>
    </Container>
  )
}
