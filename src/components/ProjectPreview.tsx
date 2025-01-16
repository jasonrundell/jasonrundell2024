import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import ProjectPreviewImage from './ProjectPreviewImage'
import Tokens from '@/lib/tokens'

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

const StyledImage = styled('div')`
  position: relative;
  display: flex;
  margin: 0 auto;
  height: 208px;
  width: auto;
  object-fit: cover;
  background-color: ${Tokens.colors.background3};
  align-items: center;
  margin-bottom: ${Tokens.sizes.medium}rem;
`

const StyledHeading = styled('h3')`
  font-size: ${Tokens.sizes.large}rem;
  line-height: 1.3;
`

export default function ProjectPreview({
  title,
  image,
  slug,
  excerpt,
}: ProjectPreviewProps) {
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
