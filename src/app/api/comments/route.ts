import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { stripHtmlTags } from '@/lib/strip-html-tags'

const COMMENT_FIELDS =
  'id, user_id, display_name, content_type, content_slug, body, created_at, updated_at'

const getCommentsSchema = z.object({
  contentType: z.enum(['post', 'project']),
  slug: z.string().min(1).max(200).trim(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().datetime().optional(),
})

const createCommentSchema = z.object({
  contentType: z.enum(['post', 'project']),
  slug: z.string().min(1).max(200).trim(),
  body: z.string().min(1).max(2000),
})

const WRITE_RATE_LIMIT = { maxAttempts: 5, windowMs: 60_000 }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const parsed = getCommentsSchema.safeParse({
      contentType: searchParams.get('contentType'),
      slug: searchParams.get('slug'),
      limit: searchParams.get('limit') ?? undefined,
      cursor: searchParams.get('cursor') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { contentType, slug, limit, cursor } = parsed.data
    const supabase = await createClient()

    let query = supabase
      .from('comments')
      .select(COMMENT_FIELDS)
      .eq('content_type', contentType)
      .eq('content_slug', slug)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    const rows = data ?? []
    const userIds = [...new Set(rows.map((c) => c.user_id))]
    const slugByUserId = new Map<string, string>()

    if (userIds.length > 0) {
      const { data: userRows, error: usersError } = await supabase
        .from('public_user_profiles')
        .select('auth_user_id, profile_slug')
        .in('auth_user_id', userIds)

      if (usersError) {
        console.error('Error fetching comment author slugs:', usersError)
        return NextResponse.json(
          { error: 'Failed to fetch comments' },
          { status: 500 }
        )
      }

      for (const u of userRows ?? []) {
        if (u.auth_user_id && u.profile_slug) {
          slugByUserId.set(u.auth_user_id, u.profile_slug)
        }
      }
    }

    const comments = rows.map((c) => ({
      ...c,
      profile_slug: slugByUserId.get(c.user_id) ?? 'user',
    }))

    return NextResponse.json({ comments })
  } catch (err) {
    console.error('Unexpected error in GET /api/comments:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(
      `comment:create:${user.id}`,
      WRITE_RATE_LIMIT
    )
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const parsed = createCommentSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { contentType, slug, body } = parsed.data
    const sanitizedBody = stripHtmlTags(body)

    if (!sanitizedBody.trim()) {
      return NextResponse.json(
        { error: 'Comment body cannot be empty' },
        { status: 400 }
      )
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('full_name, profile_slug')
      .eq('auth_user_id', user.id)
      .single()

    const displayName = userProfile?.full_name || user.email?.split('@')[0] || 'Anonymous'
    const profileSlug = userProfile?.profile_slug ?? 'user'

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        display_name: displayName,
        content_type: contentType,
        content_slug: slug,
        body: sanitizedBody,
      })
      .select(COMMENT_FIELDS)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { comment: { ...data, profile_slug: profileSlug } },
      { status: 201 }
    )
  } catch (err) {
    console.error('Unexpected error in POST /api/comments:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
