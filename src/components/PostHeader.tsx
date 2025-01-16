import { Row, Spacer } from '@jasonrundell/dropship'

import Author from './PostAuthor'
import PostImage from './PostImage'
import Tokens from '@/lib/tokens'
import { Post } from '@/typeDefinitions/app'
import { StyledHeading, StyledDescription } from '@/styles/common'

interface PostHeaderProps {
  post: Post
}

export default async function PostHeader({ post }: PostHeaderProps) {
  const { title, date, featuredImage, author } = post

  return (
    <header>
      <StyledHeading>{title}</StyledHeading>
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
