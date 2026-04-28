import React from 'react'
import Link from 'next/link'
import { Row, Spacer } from '@jasonrundell/dropship'

import { getProjects } from '@/lib/contentful'
import { toProjectCardItem } from '@/lib/projectUtils'
import {
  StyledContainer,
  StyledSection,
  StyledBreadcrumb,
} from '@/styles/common'
import MoreProjects from '@/components/MoreProjects'

export const metadata = {
  title: 'Projects | Jason Rundell',
  description:
    'A complete index of projects by Jason Rundell — open-source work, side projects, and shipped products.',
}

export const revalidate = 86400

export default async function ProjectsPage() {
  const projects = await getProjects()

  const sortedProjects = [...projects].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  return (
    <StyledContainer>
      <StyledSection id="projects">
        <StyledBreadcrumb>
          <Link href="/">Home</Link> &gt; Projects
        </StyledBreadcrumb>
        <h1>Projects</h1>
        <Row>
          <p>
            A full index of the projects I&apos;ve shipped, contributed to, or
            built for fun. Pick one to see the tech stack and a short write-up.
          </p>
        </Row>
        <Spacer />
        <Row>
          <MoreProjects items={sortedProjects.map(toProjectCardItem)} />
        </Row>
      </StyledSection>
    </StyledContainer>
  )
}
