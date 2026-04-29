import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import ContentfulImage from './ContentfulImage'
import ProjectPlaceholder from '@/public/images/project-placeholder.webp'

const imageCoverStyle: React.CSSProperties = {
  objectFit: 'cover',
}

interface ProjectPreviewImageProps {
  title: string
  /**
   * Contentful image URL. When omitted (project has no thumbnail in
   * Contentful), `ProjectPreviewImage` falls back to the local
   * refined-terminal placeholder so the preview tile keeps its 4:3 chrome
   * and visual rhythm in the grid.
   */
  url?: string
  slug?: string
  altText?: string
}

// 4:3 ratio
const StyledContainer = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
`

export default function ProjectPreviewImage({
  title,
  url,
  slug,
  altText,
}: ProjectPreviewImageProps) {
  const image = (
    <StyledContainer>
      {url ? (
        <ContentfulImage
          alt={altText ?? ''}
          src={url}
          fill={true}
          style={imageCoverStyle}
          sizes="(max-width: 272px) 100vw"
        />
      ) : (
        <Image
          src={ProjectPlaceholder}
          alt=""
          fill={true}
          style={imageCoverStyle}
          sizes="(max-width: 272px) 100vw"
        />
      )}
    </StyledContainer>
  )

  return (
    <>
      {slug ? (
        <Link href={`/projects/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  )
}
