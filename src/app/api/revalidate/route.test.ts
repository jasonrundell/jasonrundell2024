import { NextRequest } from 'next/server'

import { POST } from './route'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const { revalidatePath } = jest.requireMock<{
  revalidatePath: jest.Mock
}>('next/cache')

const SECRET = 'test-webhook-secret'

function requestFor(body: unknown, authorization = `Bearer ${SECRET}`) {
  return {
    headers: new Headers({ authorization }),
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest
}

function entry(contentType: string, fields: Record<string, unknown> = {}) {
  return {
    sys: {
      id: `${contentType}-id`,
      type: 'Entry',
      contentType: { sys: { id: contentType } },
    },
    fields,
  }
}

describe('POST /api/revalidate', () => {
  const originalSecret = process.env.CONTENTFUL_WEBHOOK_SECRET

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CONTENTFUL_WEBHOOK_SECRET = SECRET
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    process.env.CONTENTFUL_WEBHOOK_SECRET = originalSecret
    jest.restoreAllMocks()
  })

  it('requires the webhook secret to be configured', async () => {
    delete process.env.CONTENTFUL_WEBHOOK_SECRET

    const response = await POST(requestFor(entry('post')))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Webhook secret not configured',
    })
  })

  it('rejects requests with an invalid bearer token', async () => {
    const response = await POST(requestFor(entry('post'), 'Bearer wrong'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
  })

  it('rejects payloads without an entry sys object', async () => {
    const response = await POST(requestFor({ entry: null }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid payload' })
  })

  it('ignores non-entry events', async () => {
    const response = await POST(
      requestFor({
        sys: {
          id: 'asset-id',
          type: 'Asset',
          contentType: { sys: { id: 'asset' } },
        },
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      message: 'Event ignored',
      eventType: 'Asset',
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects entry payloads without a content type', async () => {
    const response = await POST(
      requestFor({
        sys: { id: 'entry-id', type: 'Entry' },
        fields: {},
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid payload: missing contentType',
    })
  })

  it('revalidates post detail and home paths for post entries', async () => {
    const response = await POST(
      requestFor(entry('post', { slug: { 'en-US': 'hello-world' } }))
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toMatchObject({
      revalidated: true,
      paths: ['/posts/hello-world', '/'],
      contentType: 'post',
      entryId: 'post-id',
      slug: 'hello-world',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/posts/hello-world')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('revalidates project detail and home paths for project entries', async () => {
    const response = await POST(
      requestFor({ entry: entry('project', { slug: { en: 'portfolio' } }) })
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.paths).toEqual(['/projects/portfolio', '/'])
    expect(revalidatePath).toHaveBeenCalledWith('/projects/portfolio')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it.each(['skill', 'reference', 'position', 'lastSong'])(
    'revalidates home for %s entries',
    async (contentType) => {
      const response = await POST(requestFor(entry(contentType)))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual(['/'])
      expect(data.slug).toBeNull()
      expect(revalidatePath).toHaveBeenCalledWith('/')
    }
  )

  it('falls back to home revalidation for unknown content types', async () => {
    const response = await POST(requestFor(entry('unknown')))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.paths).toEqual(['/'])
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns a 500 response when payload parsing fails', async () => {
    const request = {
      headers: new Headers({ authorization: `Bearer ${SECRET}` }),
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as NextRequest

    const response = await POST(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Internal server error',
    })
  })
})
