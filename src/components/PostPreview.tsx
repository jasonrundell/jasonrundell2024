import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import ContentDate from './ContentDate'
import PostPreviewImage from './PostPreviewImage'
import Tokens from '@/lib/tokens'

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

const StyledImage = styled('div')({
  position: 'relative',
  display: 'flex',
  margin: '0 auto',
  objectFit: 'cover',
  backgroundColor: Tokens.colors.background3,
  alignItems: 'center',
  marginBottom: `${Tokens.sizes.medium}rem`,
})

const StyledHeading = styled('h3')({
  fontSize: `${Tokens.sizes.large}rem`,
  lineHeight: 1.3,
})

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
          <Link href={`/posts/${slug}`}>{title}</Link>
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
