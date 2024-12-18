import React from 'react'

import { Skills, References, Projects, Posts } from '../typeDefinitions'

import Home from '@/app/Home'

import {
  getSkills,
  getReferences,
  getProjects,
  getPosts,
} from '@/lib/contentful'

export default async function page() {
  const skills = await getSkills()
  const references = await getReferences()
  const projects = await getProjects()
  const posts = await getPosts()

  return (
    <Home
      skills={{ skills } as Skills}
      projects={{ projects } as Projects}
      references={{ references } as References}
      posts={{ posts } as Posts}
    />
  )
}
