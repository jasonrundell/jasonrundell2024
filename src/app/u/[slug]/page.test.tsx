import { render, screen } from '@/__tests__/utils/test-utils'

import PublicProfileBySlugPage, { generateMetadata } from './page'

const single = jest.fn()
const limit = jest.fn()
const order = jest.fn(() => ({ limit }))
const eq = jest.fn(() => ({ single, order }))
const select = jest.fn(() => ({ eq }))
const from = jest.fn(() => ({ select }))

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(async () => ({ from })),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('not-found')
  }),
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock('@jasonrundell/dropship', () => ({
  Spacer: () => <div data-testid="spacer" />,
}))

jest.mock('@/styles/common', () => ({
  StyledBreadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav>{children}</nav>
  ),
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
  StyledHeading: ({ children }: { children: React.ReactNode }) => (
    <h1>{children}</h1>
  ),
  StyledSection: ({
    children,
    id,
  }: {
    children: React.ReactNode
    id?: string
  }) => <section id={id}>{children}</section>,
}))

jest.mock('@/components/comments/styles', () => ({
  CommentBody: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  CommentCard: ({ children }: { children: React.ReactNode }) => (
    <article>{children}</article>
  ),
  CommentDate: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  CommentsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyState: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}))

describe('public profile page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    from.mockReturnValue({ select })
    select.mockReturnValue({ eq })
    eq.mockReturnValue({ single, order })
    order.mockReturnValue({ limit })
  })

  it('generates profile metadata when the slug exists', async () => {
    single.mockResolvedValueOnce({
      data: { full_name: 'Jason Rundell' },
    })

    await expect(
      generateMetadata({ params: Promise.resolve({ slug: 'jason-rundell' }) })
    ).resolves.toEqual({
      title: 'Jason Rundell | Jason Rundell',
      description: expect.any(String),
    })
  })

  it('returns not found metadata for invalid slugs', async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: 'bad slug' }) })
    ).resolves.toEqual({ title: 'User Not Found | Jason Rundell' })
  })

  it('renders profile comments with links to source content', async () => {
    single.mockResolvedValueOnce({
      data: {
        full_name: 'Jason Rundell',
        auth_user_id: 'auth-user-id',
        created_at: '2025-01-15T12:00:00.000Z',
      },
      error: null,
    })
    limit.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          content_type: 'post',
          content_slug: 'first-post',
          body: 'Great writeup.',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          content_type: 'project',
          content_slug: 'first-project',
          body: 'Nice project.',
          created_at: new Date().toISOString(),
        },
      ],
    })

    const page = await PublicProfileBySlugPage({
      params: Promise.resolve({ slug: 'jason-rundell' }),
    })
    render(page)

    expect(screen.getByRole('heading', { name: 'Jason Rundell' })).toBeInTheDocument()
    expect(screen.getByText(/Member since January 15, 2025/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'on post: first-post' }))
      .toHaveAttribute('href', '/posts/first-post')
    expect(screen.getByRole('link', { name: 'on project: first-project' }))
      .toHaveAttribute('href', '/projects/first-project')
    expect(screen.getByText('Great writeup.')).toBeInTheDocument()
  })

  it('renders an empty comment state', async () => {
    single.mockResolvedValueOnce({
      data: {
        full_name: 'Jason Rundell',
        auth_user_id: 'auth-user-id',
        created_at: '2025-01-15T12:00:00.000Z',
      },
      error: null,
    })
    limit.mockResolvedValueOnce({ data: [] })

    const page = await PublicProfileBySlugPage({
      params: Promise.resolve({ slug: 'jason-rundell' }),
    })
    render(page)

    expect(screen.getByText('No comments yet.')).toBeInTheDocument()
  })

  it('throws not found for invalid or missing profiles', async () => {
    await expect(
      PublicProfileBySlugPage({ params: Promise.resolve({ slug: 'bad slug' }) })
    ).rejects.toThrow('not-found')

    single.mockResolvedValueOnce({ data: null, error: 'missing' })

    await expect(
      PublicProfileBySlugPage({
        params: Promise.resolve({ slug: 'jason-rundell' }),
      })
    ).rejects.toThrow('not-found')
  })
})
