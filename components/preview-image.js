import ContentfulImage from './contentful-image'
import Link from 'next/link'
import styled from '@emotion/styled'

export default function PreviewImage({ title, url, slug, altText }) {
  const StyledContainer = styled.div`
    position: relative;
    // 4:3 ratio
    width: 300px;
    height: 225px;
  `
  const image = (
    <StyledContainer>
      <ContentfulImage
        alt={altText}
        src={url}
        fill={true}
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 300px) 100vw, 225px"
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
