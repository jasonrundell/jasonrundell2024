import { GET, POST } from './route'
import { NextRequest } from 'next/server'

const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockOrder = jest.fn()
const mockLimit = jest.fn()
const mockInsert = jest.fn()
const mockSingle = jest.fn()
const mockLt = jest.fn()
const mockFrom = jest.fn()
const mockGetUser = jest.fn()

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
  })),
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(() => ({ success: true, remaining: 4 })),
}))

jest.mock('@/lib/strip-html-tags', () => ({
  stripHtmlTags: jest.fn((input: string) => input),
}))

function makeRequest(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function setupChain(data: unknown, error: unknown = null) {
  mockSingle.mockResolvedValue({ data, error })
  mockLimit.mockReturnValue({ data: data ? [data] : data, error })
  mockLt.mockReturnValue({ data: data ? [data] : data, error, limit: mockLimit })
  mockOrder.mockReturnValue({ limit: mockLimit, lt: mockLt })
  mockEq.mockReturnValue({ order: mockOrder, eq: mockEq, single: mockSingle })
  mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder, single: mockSingle })
  mockInsert.mockReturnValue({ select: mockSelect })
  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
  })
}

function setupGetCommentsSuccess(
  comment: Record<string, unknown>,
  usersError: unknown = null
) {
  const rows = [comment]
  mockFrom.mockImplementation((table: string) => {
    if (table === 'users') {
      return {
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({
            data: usersError
              ? null
              : [
                  {
                    auth_user_id: comment.user_id,
                    profile_slug: 'test-user',
                  },
                ],
            error: usersError,
          }),
        }),
      }
    }
    return {
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({ data: rows, error: null }),
            }),
          }),
        }),
      }),
    }
  })
}

describe('GET /api/comments', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 400 for missing query params', async () => {
    const req = makeRequest('http://localhost:3000/api/comments')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid contentType', async () => {
    const req = makeRequest(
      'http://localhost:3000/api/comments?contentType=invalid&slug=test'
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns comments successfully', async () => {
    const mockComment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      display_name: 'Test User',
      content_type: 'post',
      content_slug: 'test-post',
      body: 'Great post!',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }

    setupGetCommentsSuccess(mockComment)

    const req = makeRequest(
      'http://localhost:3000/api/comments?contentType=post&slug=test-post'
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.comments).toBeDefined()
    expect(data.comments[0].profile_slug).toBe('test-user')
  })

  it('returns 500 on database error', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'users') {
        return {
          select: jest.fn().mockReturnValue({
            in: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }
      }
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'DB error' },
                }),
              }),
            }),
          }),
        }),
      }
    })

    const req = makeRequest(
      'http://localhost:3000/api/comments?contentType=post&slug=test-post'
    )
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})

describe('POST /api/comments', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

    const req = makeRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'post',
        slug: 'test',
        body: 'Hello',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@test.com', app_metadata: {} } },
      error: null,
    })

    const req = makeRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ contentType: 'invalid' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for empty body text', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@test.com', app_metadata: {} } },
      error: null,
    })

    const req = makeRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'post',
        slug: 'test',
        body: '',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('creates a comment successfully', async () => {
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      email: 'test@test.com',
      app_metadata: {},
    }
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null })

    const mockCreated = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: mockUser.id,
      display_name: 'TestUser',
      content_type: 'post',
      content_slug: 'test-post',
      body: 'Great post!',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }

    setupChain(mockCreated)
    // Override for the user profile lookup
    mockEq.mockReturnValue({ single: mockSingle, eq: mockEq, order: mockOrder })
    mockSingle.mockResolvedValueOnce({
      data: { full_name: 'TestUser', profile_slug: 'tester' },
      error: null,
    })
    mockSingle.mockResolvedValueOnce({ data: mockCreated, error: null })

    const req = makeRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'post',
        slug: 'test-post',
        body: 'Great post!',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = jest.requireMock<{ rateLimit: jest.Mock }>(
      '@/lib/rate-limit'
    )
    rateLimit.mockReturnValueOnce({ success: false, remaining: 0 })

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@test.com', app_metadata: {} } },
      error: null,
    })

    const req = makeRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'post',
        slug: 'test',
        body: 'Hello',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(429)
  })
})
