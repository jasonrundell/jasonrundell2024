import ContentfulImage from './ContentfulImage'
import Link from 'next/link'

import { StyledImageContainer } from '@/styles/common'

interface PostImageProps {
  title: string
  url: string
  slug?: string
  altText: string
}

export default function PostImage({
  title,
  url,
  slug,
  altText,
}: PostImageProps) {
  const image = (
    <StyledImageContainer>
      <ContentfulImage alt={altText} src={url} fill={true} />
    </StyledImageContainer>
  )

  return (
    <>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  )
}
