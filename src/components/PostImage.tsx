import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

interface PostImageProps {
  title: string
  url: string
  slug?: string
  altText: string
}

// 4:3 ratio
const StyledContainer = styled('div')`
  position: relative;
  width: 100%;
  height: 400px;

  img {
    width: 100%;
    height: 100%;
    max-width: 300px;
    max-height: 225px;

    @media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
      width: 100%;
      height: 100%;
      max-width: 500px;
      max-height: 375px;
    }
  }
`

export default function PostImage({
  title,
  url,
  slug,
  altText,
}: PostImageProps) {
  const image = (
    <StyledContainer>
      <ContentfulImage alt={altText} src={url} fill={true} />
    </StyledContainer>
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
