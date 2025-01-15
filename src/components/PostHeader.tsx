import { styled } from '@pigment-css/react'
import { Row, Spacer } from '@jasonrundell/dropship'
import Author from './PostAuthor'
import PostImage from './PostImage'
import Tokens from '@/lib/tokens'
import { Post as PostDef } from '@/typeDefinitions/app'

interface PostHeaderProps {
  post: PostDef
}

const Heading = styled('h2')`
  font-size: ${Tokens.sizes.xlarge};
  font-weight: 700;
  color: ${Tokens.colors.secondary};
  line-height: ${Tokens.sizes.xlarge};
  margin-top: 0;
  margin-bottom: ${Tokens.sizes.xlarge};
`

const StyledDescription = styled('p')`
  font-size: ${Tokens.sizes.small};
  text-transform: italic;
  color: ${Tokens.colors.secondary};
  width: 100%;
`

const PostHeader = ({ post }: PostHeaderProps) => {
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
