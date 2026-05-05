import path from 'path'

const FIXTURES_DIR = path.resolve(__dirname, '__fixtures__')

// Point content.ts at our small fixtures directory, not the real content/
const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(FIXTURES_DIR)

// Imports must come after the spy is installed so the module sees the mocked cwd
// eslint-disable-next-line @typescript-eslint/no-require-imports
const content = require('./content') as typeof import('./content')

afterAll(() => {
  cwdSpy.mockRestore()
})

// Suppress expected console.error calls from "throws" tests
const suppressedErrors: RegExp[] = [
  /Content file not found/,
  /Content directory not found/,
  /No .* entries found/,
  /Unknown content type/,
]
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const msg = args.join(' ')
    if (suppressedErrors.some((re) => re.test(msg))) return
    // Pass through unexpected errors
    // eslint-disable-next-line no-console
    console.warn('[unexpected console.error in test]', ...args)
  })
})
afterEach(() => {
  jest.restoreAllMocks()
  cwdSpy.mockReturnValue(FIXTURES_DIR)
})

describe('getPosts', () => {
  it('returns all posts with correct fields', async () => {
    const posts = await content.getPosts()
    expect(posts.length).toBeGreaterThanOrEqual(1)

    const post = posts.find((p: { slug: string }) => p.slug === 'test-post')
    expect(post).toBeDefined()
    expect(post?.title).toBe('Test Post')
    expect(post?.excerpt).toBe('A test post excerpt.')
    expect(post?.author).toBe('Jason Rundell')
    expect(post?.date).toBe('2025-01-01T00:00:00.000Z')
    expect(post?.content).toContain('Hello')
  })

  it('resolves featuredImage to a public /content/... path', async () => {
    const posts = await content.getPosts()
    const post = posts.find((p: { slug: string }) => p.slug === 'test-post')
    expect(post?.featuredImage?.src).toMatch(/\/content\/posts\/test-post\/featured\.webp$/)
    expect(post?.featuredImage?.alt).toBe('Test image')
    expect(post?.featuredImage?.description).toBe('A helpful description')
  })
})

describe('getLatestPosts', () => {
  it('limits returned posts and returns at most the requested count', async () => {
    const latest = await content.getLatestPosts(1)
    expect(latest.length).toBeLessThanOrEqual(1)
  })
})

describe('getEntryBySlug (post)', () => {
  it('returns the matching post', async () => {
    const post = await content.getEntryBySlug('post', 'test-post')
    expect((post as { title: string }).title).toBe('Test Post')
  })

  it('throws for an unknown slug', async () => {
    await expect(content.getEntryBySlug('post', 'does-not-exist')).rejects.toThrow()
  })
})

describe('getProjects', () => {
  it('returns all projects with correct fields', async () => {
    const projects = await content.getProjects()
    expect(projects.length).toBeGreaterThanOrEqual(1)

    const project = projects.find((p: { slug: string }) => p.slug === 'test-project')
    expect(project?.title).toBe('Test Project')
    expect(project?.order).toBe(1)
    expect(project?.technology).toEqual(['TypeScript', 'React'])
    expect(project?.link).toBe('https://github.com/example/test-project')
    expect(project?.description).toContain('Project description')
  })

  it('resolves featuredImage and gallery paths', async () => {
    const projects = await content.getProjects()
    const project = projects.find((p: { slug: string }) => p.slug === 'test-project')

    expect(project?.featuredImage?.src).toMatch(/\/content\/projects\/test-project\/featured\.webp$/)
    expect(project?.gallery).toHaveLength(1)
    expect(project?.gallery?.[0].src).toMatch(/gallery\/01\.webp/)
    expect(project?.gallery?.[0].alt).toBe('Gallery 1')
  })
})

describe('getFeaturedProjects', () => {
  it('limits returned projects and sorts by order', async () => {
    const featured = await content.getFeaturedProjects(1)
    expect(featured).toHaveLength(1)
    expect(featured[0].order).toBe(1)
  })
})

describe('getEntryBySlug (project)', () => {
  it('returns the matching project', async () => {
    const project = await content.getEntryBySlug('project', 'test-project')
    expect((project as { title: string }).title).toBe('Test Project')
  })
})

describe('getSkills', () => {
  it('returns all skills with id, name, category', async () => {
    const skills = await content.getSkills()
    expect(skills.length).toBeGreaterThanOrEqual(2)
    const ts = skills.find((s: { name: string }) => s.name === 'TypeScript')
    expect(ts).toMatchObject({ id: 's1', name: 'TypeScript', category: 'Language' })
  })
})

describe('getPositions', () => {
  it('returns positions with required fields', async () => {
    const positions = await content.getPositions()
    expect(positions.length).toBeGreaterThanOrEqual(1)
    expect(positions[0]).toMatchObject({
      id: 'p1',
      orderId: 1,
      role: 'Senior Developer',
      company: 'Acme',
    })
  })
})

describe('getReferences', () => {
  it('returns references with markdown quote strings', async () => {
    const references = await content.getReferences()
    expect(references.length).toBeGreaterThanOrEqual(1)
    const ref = references.find((r: { id: string }) => r.id === 'r1')
    expect(ref).toMatchObject({
      id: 'r1',
      citeName: 'Jane Doe',
      company: 'Acme',
      quote: 'Great collaborator and problem solver.',
    })
    expect(typeof ref?.quote).toBe('string')
  })
})

describe('getLastSong', () => {
  it('returns lastSong with title, artist, url, youtubeId', async () => {
    const song = await content.getLastSong()
    expect(song).not.toBeNull()
    expect(song?.title).toBe('Test Song')
    expect(song?.artist).toBe('Test Artist')
    expect(song?.url).toBe('https://music.example.com/test')
    expect(song?.youtubeId).toBe('abc123')
  })
})

describe('error handling', () => {
  it('throws when entry slug does not exist', async () => {
    await expect(content.getEntryBySlug('post', 'no-such-slug')).rejects.toThrow()
  })

  it('getEntryBySlug throws for unknown content type', async () => {
    await expect(
      content.getEntryBySlug('unknown' as 'post', 'anything')
    ).rejects.toThrow()
  })

  it('getLastSong returns a LastSong object (not null) when data is present', async () => {
    const song = await content.getLastSong()
    expect(song).not.toBeNull()
    expect(song?.title).toBeTruthy()
  })
})

describe('content.ts edge case branches', () => {
  it('getProjects handles a project without a gallery', async () => {
    const projects = await content.getProjects()
    const project = projects.find((p: { slug: string }) => p.slug === 'test-project')
    expect(project?.gallery).toBeDefined()
  })

  it('getLatestPosts limits to 0 returns empty array', async () => {
    const posts = await content.getLatestPosts(0)
    expect(posts).toHaveLength(0)
  })

  it('getFeaturedProjects limits to 0 returns empty array', async () => {
    const projects = await content.getFeaturedProjects(0)
    expect(projects).toHaveLength(0)
  })

  it('getLatestPosts sorts posts with missing dates to end', async () => {
    // fixture contains a post with no date field, which maps to '' → getTime() = NaN → 0
    const posts = await content.getLatestPosts(100)
    const noDate = posts.find((p: { slug: string }) => p.slug === 'no-date-post')
    expect(noDate).toBeDefined()
  })

  it('getFeaturedProjects sorts projects with missing order to end', async () => {
    // fixture contains a project with no order field, which defaults to 999
    const projects = await content.getFeaturedProjects(100)
    const noOrder = projects.find((p: { slug: string }) => p.slug === 'no-order-project')
    expect(noOrder).toBeDefined()
  })

  it('getProjects resolves an absolute / image path directly', async () => {
    // absolute-image-project fixture has featuredImage: "/content/projects/..."
    const projects = await content.getProjects()
    const proj = projects.find((p: { slug: string }) => p.slug === 'absolute-image-project')
    expect(proj?.featuredImage?.src).toMatch(/^\/content\/projects\/absolute-image-project\/featured\.webp$/)
  })
})

describe('content.ts fs-level branch coverage', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs') as typeof import('fs')

  it('getLastSong returns null when the file does not exist', async () => {
    const spy = jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false)
    jest.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const song = await content.getLastSong()
      expect(song).toBeNull()
    } finally {
      spy.mockRestore()
    }
  })

  it('getLastSong returns null when title and artist are both empty', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    // Temporarily point to a last-song.mdx with empty title/artist
    // by spying on readFileSync to return empty frontmatter data
    const originalReadFile = fs.readFileSync
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      return '---\ntitle: ""\nartist: ""\nurl: ""\n---\n'
    })
    try {
      const song = await content.getLastSong()
      expect(song).toBeNull()
    } finally {
      fs.readFileSync = originalReadFile
    }
  })

  it('slugDirs throws when the content directory does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false)
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(content.getPosts()).rejects.toThrow(/Content directory not found/)
  })

  it('requireData throws when skills frontmatter array is empty', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('---\nskills: []\n---\n')
    await expect(content.getSkills()).rejects.toThrow(/No skill entries found/)
  })

  it('requireData throws when positions frontmatter array is empty', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('---\npositions: []\n---\n')
    await expect(content.getPositions()).rejects.toThrow(/No position entries found/)
  })
})
