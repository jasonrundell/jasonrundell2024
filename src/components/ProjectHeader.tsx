import styled from '@emotion/styled'
import { Row, Spacer } from '@jasonrundell/dropship'
import Link from 'next/link'
import PostImage from './PostImage'
import { tokens } from '../data/tokens'

export interface ProjectHeaderProps {
  title: string
  featuredImage: {
    file: {
      url: string
    }
    altText: string
    description: string
  }
  link?: string
}

export default function ProjectHeader({
  title,
  featuredImage,
  link,
}: ProjectHeaderProps) {
  const Heading = styled.h2`
    font-size: ${tokens['--size-xlarge']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
    line-height: ${tokens['--size-xlarge']};
    margin-top: 0;
    margin-bottom: ${tokens['--size-xlarge']};
  `

  const StyledDescription = styled.p`
    font-size: ${tokens['--size-small']};
    text-transform: italic;
    color: ${tokens['--secondary-color']};
    width: 100%;
  `

  return (
    <header>
      <Heading>{title}</Heading>
      {link && (
        <>
          <h3>View</h3>
          <Row>
            <Link href={link} target="_blank">
              Visit GitHub project
            </Link>
          </Row>
        </>
      )}
      {featuredImage?.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.file.url}
            altText={featuredImage.altText}
          />
          {featuredImage.description && (
            <StyledDescription>{featuredImage.description}</StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}
