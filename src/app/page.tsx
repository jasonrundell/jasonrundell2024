import React from 'react'

import { Skills, Projects, References, Positions, Posts } from '@/typeDefinitions/app'

import Home from '@/app/Home'

import {
  getSkills,
  getProjects,
  getReferences,
  getPositions,
  getPosts,
} from '@/lib/contentful'

export default async function page() {
  const skills = await getSkills()
  const projects = await getProjects()
  const references = await getReferences()
  const positions = await getPositions()
  const posts = await getPosts()

  return (
    <Home
      skills={{ skills } as Skills}
      projects={{ projects } as Projects}
      references={{ references } as References}
      positions={{ positions } as Positions}
      posts={{ posts } as Posts}
    />
  )
}
