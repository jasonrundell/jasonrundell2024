import { Spacer, Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import ContentDate from './ContentDate'
import PostPreviewImage from './PostPreviewImage'
import Tokens from '@/lib/tokens'
import { StyledLink } from '@/styles/common'

interface PostPreviewProps {
  title: string
  image: {
    file: {
      url: string
    }
  }
  date: string
  excerpt: string
  slug: string
}

const StyledImage = styled('div')`
  position: relative;
  display: flex;
  object-fit: cover;
  background-color: ${Tokens.colors.backgroundDarker.value};
`

const StyledHeading = styled('h3')`
  font-size: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  line-height: 1.3;
`

export default function PostPreview({
  title,
  image,
  date,
  excerpt,
  slug,
}: PostPreviewProps) {
  return (
    <div>
      {image && image.file && (
        <Row>
          <StyledImage>
            <PostPreviewImage
              title={title}
              slug={slug}
              url={image.file.url}
              altText=""
            />
          </StyledImage>
        </Row>
      )}
      <Row>
        <StyledHeading>
          <StyledLink href={`/posts/${slug}`}>
            {title}
          </StyledLink>
        </StyledHeading>
      </Row>
      <Row>
        <ContentDate dateString={date} />
      </Row>
      <Row>
        <p>{excerpt}</p>
      </Row>
      <Spacer />
    </div>
  )
}
