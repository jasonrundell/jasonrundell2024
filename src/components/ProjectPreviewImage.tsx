import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

interface PostPreviewImageProps {
  title: string
  url: string
  slug?: string
  altText?: string
}

// 4:3 ratio
const StyledContainer = styled('div')`
  position: relative;
  width: 272px;
  height: 204px;
  @media (min-width: 360px) {
    width: 320px;
    height: 240px;
  }
  @media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
    width: 361px;
    height: 270px;
  }
`

export default function ProjectPreviewImage({
  title,
  url,
  slug,
  altText,
}: PostPreviewImageProps) {
  const image = (
    <StyledContainer>
      <ContentfulImage
        alt={altText}
        src={url}
        fill={true}
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 272px) 100vw"
      />
    </StyledContainer>
  )

  return (
    <>
      {slug ? (
        <Link href={`/project/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  )
}
