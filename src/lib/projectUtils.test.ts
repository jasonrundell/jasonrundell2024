import { toProjectCardItem } from './projectUtils'
import { Project } from '@/typeDefinitions/app'

const baseProject: Project = {
  title: 'Test Project',
  slug: 'test-project',
  order: 1,
  excerpt: 'A test excerpt',
  description: null as never,
  technology: ['TypeScript'],
}

describe('toProjectCardItem', () => {
  it('maps a project with full featuredImage data', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        metadata: { tags: [], concepts: [] },
        sys: {} as never,
        fields: {
          title: 'Image Title',
          altText: 'Alt text',
          description: 'Image description',
          file: {
            metadata: { tags: [], concepts: [] },
            sys: {} as never,
            fields: {
              title: 'File Title',
              file: {
                url: 'https://example.com/image.webp',
                details: { size: 1000, image: { width: 800, height: 600 } },
                fileName: 'image.webp',
                contentType: 'image/webp',
              },
            },
          },
        },
      },
    }

    const result = toProjectCardItem(project)

    expect(result).toEqual({
      title: 'Test Project',
      excerpt: 'A test excerpt',
      slug: 'test-project',
      featuredImage: {
        file: { url: 'https://example.com/image.webp' },
        altText: 'Alt text',
        description: 'Image description',
      },
    })
  })

  it('falls back to empty strings when featuredImage is undefined', () => {
    const result = toProjectCardItem(baseProject)

    expect(result).toEqual({
      title: 'Test Project',
      excerpt: 'A test excerpt',
      slug: 'test-project',
      featuredImage: {
        file: { url: '' },
        altText: '',
        description: '',
      },
    })
  })

  it('falls back to empty strings when featuredImage fields are missing optional properties', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        metadata: { tags: [], concepts: [] },
        sys: {} as never,
        fields: {
          title: 'Image Title',
          file: {
            metadata: { tags: [], concepts: [] },
            sys: {} as never,
            fields: {
              title: 'File Title',
              file: {
                url: 'https://example.com/image.webp',
                details: { size: 1000, image: { width: 800, height: 600 } },
                fileName: 'image.webp',
                contentType: 'image/webp',
              },
            },
          },
        },
      },
    }

    const result = toProjectCardItem(project)

    expect(result.featuredImage.altText).toBe('')
    expect(result.featuredImage.description).toBe('')
    expect(result.featuredImage.file.url).toBe('https://example.com/image.webp')
  })

  it('falls back to empty url when file fields are missing', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        metadata: { tags: [], concepts: [] },
        sys: {} as never,
        fields: {
          title: 'Image Title',
          altText: 'Alt text',
          description: 'Desc',
          file: undefined as never,
        },
      },
    }

    const result = toProjectCardItem(project)

    expect(result.featuredImage.file.url).toBe('')
    expect(result.featuredImage.altText).toBe('Alt text')
    expect(result.featuredImage.description).toBe('Desc')
  })
})
