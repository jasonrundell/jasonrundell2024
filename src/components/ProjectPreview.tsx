import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import ProjectPreviewImage from './ProjectPreviewImage'
import { tokens } from '@/data/tokens'

interface ProjectPreviewProps {
  title: string
  image: {
    file: {
      url: string
    }
  }
  excerpt: string
  slug: string
}

export default function ProjectPreview({
  title,
  image,
  slug,
  excerpt,
}: ProjectPreviewProps) {
  const StyledImage = styled.div`
    position: relative;
    display: flex;
    margin: 0 auto;
    height: 208px;
    width: auto;
    object-fit: cover;
    background-color: ${tokens['--background-color-3']};
    align-items: center;
    margin-bottom: ${tokens['--size-normal']};
  `

  const StyledHeading = styled.h3`
    font-size: ${tokens['--size-large']};
    line-height: 1.3;
  `

  return (
    <div>
      {image && image.file && (
        <Row>
          <StyledImage>
            <ProjectPreviewImage
              title={title}
              slug={slug}
              url={image.file.url}
            />
          </StyledImage>
        </Row>
      )}
      <Spacer />
      <Row>
        <StyledHeading>
          <Link href={`/projects/${slug}`}>{title}</Link>
        </StyledHeading>
      </Row>
      <Spacer />
      <Row>
        <p>{excerpt}</p>
      </Row>
      <Spacer />
    </div>
  )
}
