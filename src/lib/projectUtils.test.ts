import { compareProjectsByDateDesc, toProjectCardItem } from './projectUtils'
import { Project } from '@/typeDefinitions/app'

const baseProject: Project = {
  title: 'Test Project',
  slug: 'test-project',
  createdDate: '2025-01-01T00:00:00.000Z',
  excerpt: 'A test excerpt',
  description: '',
  technology: ['TypeScript'],
}

describe('compareProjectsByDateDesc', () => {
  it('orders newer projects before older ones', () => {
    const older: Project = { ...baseProject, createdDate: '2020-01-01T00:00:00.000Z' }
    const newer: Project = {
      ...baseProject,
      slug: 'p2',
      createdDate: '2021-01-01T00:00:00.000Z',
    }
    expect(compareProjectsByDateDesc(older, newer)).toBeGreaterThan(0)
    expect(compareProjectsByDateDesc(newer, older)).toBeLessThan(0)
  })
})

describe('toProjectCardItem', () => {
  it('maps the fields the card list needs', () => {
    const project: Project = {
      ...baseProject,
      technology: ['TypeScript', 'React'],
    }

    const result = toProjectCardItem(project)

    expect(result).toEqual({
      title: 'Test Project',
      excerpt: 'A test excerpt',
      slug: 'test-project',
      createdDate: '2025-01-01T00:00:00.000Z',
      technology: ['TypeScript', 'React'],
    })
  })

  it('preserves an empty technology list without inventing data', () => {
    const project: Project = { ...baseProject, technology: [] }

    const result = toProjectCardItem(project)

    expect(result.technology).toEqual([])
  })

  it('does not carry the featured image onto the card item', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        src: '/content/projects/test-project/featured.webp',
        alt: 'Alt text',
      },
    }

    const result = toProjectCardItem(project)

    expect(result).not.toHaveProperty('featuredImage')
  })
})
