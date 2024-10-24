import styled from '@emotion/styled'
import { Heading, Row, Spacer } from '@jasonrundell/dropship'
import Author from '../components/author'
import PostImage from '../components/post-image'
import { tokens } from '../data/tokens'

export default function PostHeader({ title, featuredImage, date, author }) {
  const HeadingOne = styled.h1`
    font-size: ${tokens['--size-xlarge']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
    line-height: ${tokens['--size-xlarge']};
    margin-top: 0;
    margin-bottom: ${tokens['--size-xlarge']};
  `

  return (
    <header>
      <HeadingOne>{title}</HeadingOne>
      {author && (
        <>
          <Author name={author.name} picture={author.picture} date={date} />
          <Spacer />
        </>
      )}
      {featuredImage && featuredImage.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.file.url}
            altText={featuredImage.altText}
          />
          {featuredImage.description && (
            <Row classNames="text-center mt-2 text-gray-500 italic">
              {featuredImage.description}
            </Row>
          )}
        </Row>
      )}
    </header>
  )
}
