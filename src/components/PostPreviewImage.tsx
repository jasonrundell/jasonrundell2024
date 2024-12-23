import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import styled from '@emotion/styled'

interface PostPreviewImageProps {
  title: string
  url: string
  slug?: string
  altText: string
}

export default function PostPreviewImage({
  title,
  url,
  slug,
  altText,
}: PostPreviewImageProps) {
  const StyledContainer = styled.div`
    position: relative;
    // 4:3 ratio
    width: 272px;
    height: 204px;

    @media (min-width: 360px) {
      width: 320px;
      height: 240px;
    }

    @media (min-width: 48rem) {
      width: 361px;
      height: 270px;
    }
  `
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
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  )
}
