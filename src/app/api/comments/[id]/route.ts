import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import DOMPurify from 'isomorphic-dompurify'

const COMMENT_FIELDS =
  'id, user_id, display_name, content_type, content_slug, body, created_at, updated_at'

const uuidSchema = z.string().uuid()

const updateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
})

const WRITE_RATE_LIMIT = { maxAttempts: 5, windowMs: 60_000 }

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParse = uuidSchema.safeParse(id)
    if (!idParse.success) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(
      `comment:update:${user.id}`,
      WRITE_RATE_LIMIT
    )
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Application-layer ownership check (defense-in-depth with RLS)
    const { data: existing } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    const parsed = updateCommentSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const sanitizedBody = DOMPurify.sanitize(parsed.data.body, {
      ALLOWED_TAGS: [],
    })

    if (!sanitizedBody.trim()) {
      return NextResponse.json(
        { error: 'Comment body cannot be empty' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .update({
        body: sanitizedBody,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(COMMENT_FIELDS)
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json(
        { error: 'Failed to update comment' },
        { status: 500 }
      )
    }

    const { data: authorProfile } = await supabase
      .from('users')
      .select('profile_slug')
      .eq('auth_user_id', user.id)
      .single()

    return NextResponse.json({
      comment: {
        ...data,
        profile_slug: authorProfile?.profile_slug ?? 'user',
      },
    })
  } catch (err) {
    console.error('Unexpected error in PATCH /api/comments/[id]:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParse = uuidSchema.safeParse(id)
    if (!idParse.success) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(
      `comment:delete:${user.id}`,
      WRITE_RATE_LIMIT
    )
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const { data: existing } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const isAdmin = user.app_metadata?.role === 'admin'
    const isOwner = existing.user_id === user.id

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('comments').delete().eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/comments/[id]:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
