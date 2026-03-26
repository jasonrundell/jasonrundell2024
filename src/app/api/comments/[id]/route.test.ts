import { PATCH, DELETE } from './route'
import { NextRequest } from 'next/server'

const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockSingle = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
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

jest.mock('isomorphic-dompurify', () => ({
  sanitize: jest.fn((input: string) => input),
}))

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const USER_UUID = '123e4567-e89b-12d3-a456-426614174001'
const OTHER_UUID = '123e4567-e89b-12d3-a456-426614174002'

function makeRequest(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

function setupChain(data: unknown, error: unknown = null) {
  mockSingle.mockResolvedValue({ data, error })
  mockEq.mockReturnValue({ single: mockSingle, eq: mockEq, select: mockSelect })
  mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle })
  mockUpdate.mockReturnValue({ eq: mockEq })
  mockDelete.mockReturnValue({ eq: mockEq })
  mockFrom.mockReturnValue({
    select: mockSelect,
    update: mockUpdate,
    delete: mockDelete,
  })
}

describe('PATCH /api/comments/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 404 for invalid UUID', async () => {
    const req = makeRequest('http://localhost:3000/api/comments/not-a-uuid', {
      method: 'PATCH',
      body: JSON.stringify({ body: 'Updated' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'not-a-uuid' }) })
    expect(res.status).toBe(404)
  })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: 'Updated' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(401)
  })

  it('returns 403 when not the owner', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })
    setupChain({ user_id: OTHER_UUID })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: 'Updated' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(403)
  })

  it('returns 400 for invalid body', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })
    setupChain({ user_id: USER_UUID })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(400)
  })

  it('updates a comment successfully', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })

    const updated = {
      id: VALID_UUID,
      user_id: USER_UUID,
      display_name: 'TestUser',
      content_type: 'post',
      content_slug: 'test-post',
      body: 'Updated comment',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    }

    // First call: ownership check returns owner
    // Second call: update returns updated comment
    mockSingle
      .mockResolvedValueOnce({ data: { user_id: USER_UUID }, error: null })
      .mockResolvedValueOnce({ data: updated, error: null })
    mockEq.mockReturnValue({ single: mockSingle, eq: mockEq, select: mockSelect })
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle })
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
    })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: 'Updated comment' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PATCH(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(200)
  })
})

describe('DELETE /api/comments/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 404 for invalid UUID', async () => {
    const req = makeRequest('http://localhost:3000/api/comments/not-a-uuid', {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: 'not-a-uuid' }) })
    expect(res.status).toBe(404)
  })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(401)
  })

  it('returns 403 when not owner and not admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })
    setupChain({ user_id: OTHER_UUID })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(403)
  })

  it('allows owner to delete', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })

    mockSingle.mockResolvedValue({ data: { user_id: USER_UUID }, error: null })
    mockEq.mockReturnValue({ single: mockSingle, eq: mockEq })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockDelete.mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({
      select: mockSelect,
      delete: mockDelete,
    })
    // Override for the delete eq chain: return success
    mockEq.mockReturnValueOnce({ single: mockSingle })
      .mockReturnValueOnce({ data: null, error: null })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(204)
  })

  it('allows admin to delete any comment', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: { role: 'admin' } } },
      error: null,
    })

    mockSingle.mockResolvedValue({ data: { user_id: OTHER_UUID }, error: null })
    mockEq.mockReturnValue({ single: mockSingle, eq: mockEq })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockDelete.mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({
      select: mockSelect,
      delete: mockDelete,
    })
    mockEq.mockReturnValueOnce({ single: mockSingle })
      .mockReturnValueOnce({ data: null, error: null })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(204)
  })

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = jest.requireMock<{ rateLimit: jest.Mock }>(
      '@/lib/rate-limit'
    )
    rateLimit.mockReturnValueOnce({ success: false, remaining: 0 })

    mockGetUser.mockResolvedValue({
      data: { user: { id: USER_UUID, app_metadata: {} } },
      error: null,
    })

    const req = makeRequest(`http://localhost:3000/api/comments/${VALID_UUID}`, {
      method: 'DELETE',
    })
    const res = await DELETE(req, { params: Promise.resolve({ id: VALID_UUID }) })
    expect(res.status).toBe(429)
  })
})
