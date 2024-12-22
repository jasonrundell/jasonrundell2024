'use client'

import styled from '@emotion/styled'
import { Row, Spacer } from '@jasonrundell/dropship'
import Author from './PostAuthor'
import PostImage from './PostImage'
import { tokens } from '@/data/tokens'
import { Post as PostDef } from '@/typeDefinitions/app'

interface PostHeaderProps {
  post: PostDef
}

const PostHeader = ({ post }: PostHeaderProps) => {
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

  const { title, date, featuredImage, author } = post

  return (
    <header>
      <Heading>{title}</Heading>
      {author && (
        <>
          <Author
            name={author.fields.name}
            picture={author.fields.picture.fields.file}
            date={date}
          />
          <Spacer />
        </>
      )}
      {featuredImage?.fields.file.fields.file.url && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.fields.file.fields.file.url}
            altText={featuredImage.fields.altText || ''}
          />
          {featuredImage.fields.description && (
            <StyledDescription>
              {featuredImage.fields.description}
            </StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}

export default PostHeader
