import { Container, Heading, Section, Row, Box } from '@jasonrundell/dropship'
import Author from '../components/author'
import CoverImage from '../components/cover-image'

export default function PostHeader({ title, coverImage, date, author }) {
  console.log('date', date)
  return (
    <Container>
      <Section>
        <Heading level={1} label={title} classNames="font-bold" />
        {author && (
          <Box>
            <Author name={author.name} picture={author.picture} date={date} />
          </Box>
        )}
        <Row>
          <CoverImage title={title} url={coverImage.url} />
          <Row classNames="text-center mt-2 text-gray-500 italic">
            {coverImage.description}
          </Row>
        </Row>
      </Section>
    </Container>
  )
}
