import styled from '@emotion/styled'
import { Row, Spacer } from '@jasonrundell/dropship'
import Author from './PostAuthor'
import PostImage from './PostImage'
import { tokens } from '../data/tokens'

export interface PostHeaderProps {
  title: string
  featuredImage: {
    file: {
      url: string
    }
    altText: string
    description: string
  }
  date: string
  author: {
    name: string
    picture: {
      url: string
    }
  }
}

export default function PostHeader({
  title,
  featuredImage,
  date,
  author,
}: PostHeaderProps) {
  const Heading = styled.h2`
    font-size: ${tokens['--size-xlarge']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
    line-height: ${tokens['--size-xlarge']};
    margin-top: 0;
    margin-bottom: ${tokens['--size-xlarge']};
  `

  const StyledDescription = styled.p`
    font-size: ${tokens['--size-small']};
    text-transform: italic;
    color: ${tokens['--secondary-color']};
    width: 100%;
  `

  return (
    <header>
      <Heading>{title}</Heading>
      {author && (
        <>
          <Author name={author.name} picture={author.picture} date={date} />
          <Spacer />
        </>
      )}
      {featuredImage?.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.file.url}
            altText={featuredImage.altText}
          />
          {featuredImage.description && (
            <StyledDescription>{featuredImage.description}</StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}
