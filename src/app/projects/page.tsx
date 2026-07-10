import React from 'react'
import type { Metadata } from 'next'

import { getProjects } from '@/lib/content'
import { compareProjectsByDateDesc, toProjectCardItem } from '@/lib/projectUtils'
import {
  BandSection,
  Container,
  Eyebrow,
  DisplayTitle,
  Lead,
} from '@/styles/editorial'
import MoreProjects from '@/components/MoreProjects'
import { SITE_DOMAIN } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Selected work | Jason Rundell',
  description:
    'Selected work by Jason Rundell — shipped products, open-source, and side projects across leadership and hands-on engineering.',
  alternates: { canonical: `${SITE_DOMAIN}/projects` },
}

export const revalidate = 86400

export default async function ProjectsPage() {
  const projects = await getProjects()
  const sortedProjects = [...projects].sort(compareProjectsByDateDesc)

  return (
    <>
      <BandSection tone="paper">
        <Container>
          <Eyebrow label="Selected work" />
          <DisplayTitle>Things I&rsquo;ve built and shipped</DisplayTitle>
          <Lead>
            A full index of projects I&rsquo;ve shipped, contributed to, or
            built for the craft of it. Pick one for the stack and a short
            write-up.
          </Lead>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <MoreProjects items={sortedProjects.map(toProjectCardItem)} />
        </Container>
      </BandSection>
    </>
  )
}
