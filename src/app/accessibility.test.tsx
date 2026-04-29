import axe from 'axe-core'
import { cleanup, render } from '@testing-library/react'

import HomePage from './page'
import AboutPage from './about/page'
import ProjectsPage from './projects/page'
import PostsPage from './posts/page'
import ContactPage from './contact/page'
import NotFound from './not-found'

jest.mock('lucide-react', () => ({
  ExternalLink: () => <span aria-hidden="true">External link</span>,
}))

jest.mock('next/dynamic', () => {
  return function mockDynamic() {
    return function MockDynamicComponent() {
      return <aside aria-label="Last song">Last song</aside>
    }
  }
})

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
})

jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    fill,
    priority,
  quality,
    ...props
  }: {
    src: string | { src?: string }
    alt: string
    fill?: boolean
    priority?: boolean
    quality?: number
    [key: string]: unknown
  }) {
    void fill
    void priority
    void quality

    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={typeof src === 'string' ? src : src.src ?? ''}
        alt={alt}
        {...props}
      />
    )
  }
})

jest.mock('@/lib/contentful', () => ({
  getFeaturedProjects: jest.fn(),
  getLatestPosts: jest.fn(),
  getLastSong: jest.fn(),
  getProjects: jest.fn(),
  getPosts: jest.fn(),
  getSkills: jest.fn(),
  getReferences: jest.fn(),
  getPositions: jest.fn(),
}))

jest.mock('@/components/HeroTerminal', () => ({
  __esModule: true,
  default: ({ heading, pitch }: { heading: string; pitch: string }) => (
    <section aria-label="Hero">
      <h1>{heading}</h1>
      <p>{pitch}</p>
    </section>
  ),
}))

jest.mock('@/components/HubDoors', () => ({
  __esModule: true,
  default: ({
    doors,
    ariaLabel,
  }: {
    doors: { href: string; label: string; description?: string }[]
    ariaLabel?: string
  }) => (
    <nav aria-label={ariaLabel}>
      {doors.map((door) => (
        <a key={door.href} href={door.href}>
          <span>{door.label}</span>
          {door.description && <span>{door.description}</span>}
        </a>
      ))}
    </nav>
  ),
}))

jest.mock('@/components/MoreProjects', () => {
  return function MockMoreProjects({
    items,
  }: {
    items: { slug: string; title: string }[]
  }) {
    return (
      <ul aria-label="Projects">
        {items.map((item) => (
          <li key={item.slug}>
            <a href={`/projects/${item.slug}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    )
  }
})

jest.mock('@/components/MorePosts', () => {
  return function MockMorePosts({
    posts,
  }: {
    posts: { slug: string; title: string }[]
  }) {
    return (
      <ul aria-label="Posts">
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/posts/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    )
  }
})

jest.mock('@/components/LastSong', () => {
  return function MockLastSong() {
    return <aside aria-label="Last song">Last song</aside>
  }
})

jest.mock('@/components/Skills', () => {
  return function MockSkills({ skills }: { skills: { name: string }[] }) {
    return (
      <ul aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>
    )
  }
})

jest.mock('@/components/Positions', () => {
  return function MockPositions({
    positions,
  }: {
    positions: { company: string }[]
  }) {
    return (
      <ul aria-label="Experience">
        {positions.map((position) => (
          <li key={position.company}>{position.company}</li>
        ))}
      </ul>
    )
  }
})

jest.mock('@/components/References', () => {
  return function MockReferences({
    references,
  }: {
    references: { citeName: string }[]
  }) {
    return (
      <ul aria-label="Recommendations">
        {references.map((reference) => (
          <li key={reference.citeName}>{reference.citeName}</li>
        ))}
      </ul>
    )
  }
})

jest.mock('@/components/Icon', () => {
  return function MockIcon({ type }: { type: string }) {
    return <span aria-hidden="true">{type}</span>
  }
})

jest.mock('@/components/chrome', () => ({
  SectionHeading: ({
    children,
    level = 2,
  }: {
    children: React.ReactNode
    level?: 2 | 3
  }) => {
    const Heading = level === 3 ? 'h3' : 'h2'
    return <Heading>{children}</Heading>
  },
  PromptList: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => <ul {...props}>{children}</ul>,
  PromptItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
}))

const {
  getFeaturedProjects,
  getLatestPosts,
  getLastSong,
  getProjects,
  getPosts,
  getSkills,
  getReferences,
  getPositions,
} = jest.requireMock<{
  getFeaturedProjects: jest.Mock
  getLatestPosts: jest.Mock
  getLastSong: jest.Mock
  getProjects: jest.Mock
  getPosts: jest.Mock
  getSkills: jest.Mock
  getReferences: jest.Mock
  getPositions: jest.Mock
}>('@/lib/contentful')

const { usePathname } = jest.requireMock<{
  usePathname: jest.Mock
}>('next/navigation')

const routes = [
  {
    path: '/',
    renderRoute: async () => <main>{await HomePage()}</main>,
  },
  {
    path: '/about',
    renderRoute: async () => <main>{await AboutPage()}</main>,
  },
  {
    path: '/projects',
    renderRoute: async () => <main>{await ProjectsPage()}</main>,
  },
  {
    path: '/posts',
    renderRoute: async () => <main>{await PostsPage()}</main>,
  },
  {
    path: '/contact',
    renderRoute: async () => <main>{ContactPage()}</main>,
  },
  {
    path: '/not-found',
    renderRoute: async () => await NotFound(),
  },
] as const

async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe.run(container)
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    nodes: violation.nodes.map((node) => node.target.join(' ')),
  }))

  expect(violations).toEqual([])
}

describe('route accessibility audit', () => {
  beforeEach(() => {
    const projects = [
      { slug: 'project-a', title: 'Project A', excerpt: 'Project excerpt' },
      { slug: 'project-b', title: 'Project B', excerpt: 'Project excerpt' },
      { slug: 'project-c', title: 'Project C', excerpt: 'Project excerpt' },
    ]
    const posts = [
      { slug: 'post-a', title: 'Post A', date: '2025-01-01' },
      { slug: 'post-b', title: 'Post B', date: '2024-01-01' },
      { slug: 'post-c', title: 'Post C', date: '2023-01-01' },
    ]
    getFeaturedProjects.mockResolvedValue(projects)
    getLatestPosts.mockResolvedValue(posts)
    getLastSong.mockResolvedValue({
      title: 'Song',
      artist: 'Artist',
      url: 'https://music.youtube.com/watch?v=test',
    })
    getProjects.mockResolvedValue(projects)
    getPosts.mockResolvedValue(posts)
    getSkills.mockResolvedValue([{ name: 'React' }, { name: 'TypeScript' }])
    getReferences.mockResolvedValue([{ citeName: 'Jane Doe' }])
    getPositions.mockResolvedValue([{ company: 'Example Co' }])
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it.each(routes)(
    'has no axe-core violations on $path',
    async ({ path, renderRoute }) => {
      usePathname.mockReturnValue(path)
      const route = await renderRoute()
      const { container } = render(route)

      await expectNoAxeViolations(container)
    }
  )
})
