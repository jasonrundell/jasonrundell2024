import { styled } from '@pigment-css/react'
import { Row, Heading } from '@jasonrundell/dropship'
import Link from 'next/link'

import PostImage from './PostImage'
import Tokens from '@/lib/tokens'
import { Project } from '@/typeDefinitions/app'
import {
  StyledHeading,
  StyledDescription,
  StyledHeading3,
} from '@/styles/common'

interface ProjectHeaderProps {
  project: Project
}

export default async function ProjectHeader({ project }: ProjectHeaderProps) {
  const { title, featuredImage, link } = project

  return (
    <header>
      <StyledHeading>{title}</StyledHeading>
      {link && (
        <>
          <StyledHeading3 level={3}>View</StyledHeading3>
          <Row>
            <Link href={link} target="_blank">
              Visit GitHub project
            </Link>
          </Row>
        </>
      )}
      {featuredImage?.fields?.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.fields.file.fields.file.url}
            altText={featuredImage.fields.altText || ''}
          />
          {featuredImage.fields.description && (
            <StyledDescription>
              {featuredImage.fields.description}
            </StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}
